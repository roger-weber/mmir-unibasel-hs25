import boto3
import json
import base64
import os
import requests
import datetime
import random
import time
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth
from IPython.display import display, clear_output, HTML, Markdown

#--- generic helper functions

session = None
bedrock_client = None
bedrock_runtime_client = None
sts_client = None
s3_client = None
oss_client = None
translate = None

def random_date(date_range_days = 5 * 365):
    # Get the current date
    end_date = datetime.date.today()
    
    # Calculate the start date (5 years ago)
    start_date = end_date - datetime.timedelta(days=date_range_days)
    
    # Calculate the range of days between start and end dates
    date_range = (end_date - start_date).days
    
    # Generate a random number of days within this range
    random_days = random.randint(0, date_range)
    
    # Create the random date by adding the random number of days to the start date
    random_date = start_date + datetime.timedelta(days=random_days)
    
    return random_date


def get_current_role_arn():
    try:
        # Get the caller identity
        response = sts_client.get_caller_identity()
        
        # Extract the ARN from the response
        arn = response['Arn']
        
        # Check if this is an assumed role
        if ':assumed-role/' in arn:
            # Parse the ARN to get the role name
            parts = arn.split(':')
            account_id = parts[4]
            role_name = parts[5].split('/')[1]
            
            # Construct the role ARN
            role_arn = f"arn:aws:iam::{account_id}:role/{role_name}"
            return role_arn
        else:
            # If it's not an assumed role, return the original ARN
            return arn
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None



#--- Tranlsate functions

# lang: en, de, fr, it, es, ...
def detect_language(text):
    response = translate.detect_languages(
        Text=text,
        Settings={
            'Formality': 'FORMAL',
            'Profanity': 'MASK'
        }
    )
    return response['Languages'][0]['LanguageCode']

def translate_text(text, source_lang, target_lang):
    response = translate.translate_text(
        Text=text,
        SourceLanguageCode=source_lang,
        TargetLanguageCode=target_lang
    )
    return response['TranslatedText']   



#--- Claude model invocation, Haiku and Sonnet with multi-modal support

SONET_MODEL_ID = 'anthropic.claude-3-5-sonnet-20240620-v1:0'
HAIKU_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0'

def anthropic_message_body(text, system=None, max_tokens=4096, image=None, temperature=None, top_p=None, top_k=None, history=None, prefill=""):
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "messages": []
    }
    if system:
        body['system'] = system
    if max_tokens:
        body['max_tokens'] = max_tokens

    if history:
        roles = ['user', 'assistant']
        for i, message in enumerate(history):
            body['messages'].append({
                "role": roles[i % len(roles)],
                "content": [
                    {
                        "type": "text",
                        "text": message
                    }
                ]
            })
    body['messages'].append(
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": text
                }
            ]
        }
    )
    if image:
        body['messages'][-1]['content'].append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": base64.b64encode(image).decode('utf-8')
            }
        })
    if prefill:
        body['messages'].append(
            {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": prefill
                    }
                ]
            }
        )
    if temperature:
        body['temperature'] = temperature
    if top_p:
        body['top_p'] = top_p
    if top_k:
        body['top_k'] = top_k
    return json.dumps(body)

def estimate_cost(usage, haiku):
    if haiku:
        return (usage['input_tokens'] * 0.00025 / 1000) + (usage['output_tokens'] * 0.00125 / 1000)
    else:
        return (usage['input_tokens'] * 0.003 / 1000) + (usage['output_tokens'] * 0.015 / 1000)

def get_image_description(image, prompt, prefill="", haiku=False, metrics=None):
    if metrics is not None:
        start_time = time.time()
    response = bedrock_runtime_client.invoke_model(
        body=anthropic_message_body(
            prompt, 
            image=image,
            prefill=prefill
        ),
        modelId= HAIKU_MODEL_ID if haiku else SONET_MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    response = json.loads(response.get("body").read())
    if metrics is not None:
        metrics['time'] = time.time() - start_time
        metrics['cost'] = estimate_cost(response['usage'], haiku)
    return prefill + response['content'][0]['text']


def get_text_answer(prompt, prefill="", haiku=False, metrics=None):
    if metrics is not None:
        start_time = time.time()
    response = bedrock_runtime_client.invoke_model(
        body=anthropic_message_body(
            prompt, 
            prefill=prefill
        ),
        modelId= HAIKU_MODEL_ID if haiku else SONET_MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    response = json.loads(response.get("body").read())
    if metrics is not None:
        metrics['time'] = time.time() - start_time
        metrics['cost'] = estimate_cost(response['usage'], haiku)
    return prefill + response['content'][0]['text']

def llm_invoke(prompt, system=None, max_tokens=4096, image=None, temperature=None, top_p=None, top_k=None, history=None, prefill="", haiku=False, metrics=None):
    if metrics is not None:
        start_time = time.time()
    response = bedrock_runtime_client.invoke_model(
        body=anthropic_message_body(
            prompt,
            system,
            max_tokens,
            image,
            temperature,
            top_p,
            top_k,
            history,
            prefill
        ),
        modelId= HAIKU_MODEL_ID if haiku else SONET_MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    response = json.loads(response.get("body").read())
    if metrics is not None:
        metrics['time'] = time.time() - start_time
        metrics['cost'] = estimate_cost(response['usage'], haiku)
    return prefill + response['content'][0]['text']

#--- Embeddings with Titan models

def get_text_embedding(text, dimensions=512):
    MODEL_ID = 'amazon.titan-embed-text-v2:0'
    
    def titan_text_embedding_body(text, dimensions=512):
        body = {
            "inputText": text,
            "dimensions": dimensions,
            "normalize": True
        }
        return json.dumps(body)

    response = bedrock_runtime_client.invoke_model(
        body=titan_text_embedding_body(text, dimensions),
        modelId=MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    return json.loads(response.get("body").read())["embedding"]


def get_image_embedding(image=None, text=None, dimensions=384):
    MODEL_ID = 'amazon.titan-embed-image-v1'

    def titan_image_embedding_body(image=None, text=None, dimensions=384):
        body = {
            "embeddingConfig": { 
                "outputEmbeddingLength": dimensions
            }
        }
        if image:
            body["inputImage"] = base64.b64encode(image).decode('utf-8')
        if text:
            body["inputText"] = text
        return json.dumps(body)

    response = bedrock_runtime_client.invoke_model(
        body=titan_image_embedding_body(image, text, dimensions),
        modelId=MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    return json.loads(response.get("body").read())["embedding"]



#--- OpenSearch Serverless helper functions

def get_collection(collection_name):
    response = oss_client.batch_get_collection(
        names=[collection_name]
    )
    if len(response['collectionDetails']) == 0:
        return None
    return response['collectionDetails'][0]

def delete_collection(collection_name):
    c = get_collection(collection_name)
    if not c:
        return
    id = c['id']
    access_policy_name = collection_name+'-acc-policy'
    network_policy_name = collection_name+'-net-policy'
    encryption_policy_name = collection_name+'-enc-policy'
    
    # delete collection and policies
    oss_client.delete_collection(id=id)
    oss_client.delete_access_policy(type='data', name=access_policy_name)
    oss_client.delete_security_policy(type='network', name=network_policy_name)
    oss_client.delete_security_policy(type='encryption', name=encryption_policy_name)

def create_collection(collection_name, delete_if_exists=False):
    access_policy_name = collection_name+'-acc-policy'
    network_policy_name = collection_name+'-net-policy'
    encryption_policy_name = collection_name+'-enc-policy'
    identity = boto3.client('sts').get_caller_identity()['Arn']
    workshop_role = ':'.join(get_current_role_arn().split(':')[0:-1]+['role/WSParticipantRole'])

    # check if collection already exists
    if get_collection(collection_name):
        if not delete_if_exists:
            return
        delete_collection(collection_name)
    
    # create encryption policy
    oss_client.create_security_policy(
            name=encryption_policy_name,
            policy=json.dumps(
                {
                    'Rules': [{'Resource': ['collection/' + collection_name],
                               'ResourceType': 'collection'}],
                    'AWSOwnedKey': True
                }),
            type='encryption'
        )

    # create network policy
    oss_client.create_security_policy(
        name=network_policy_name,
        policy=json.dumps(
            [
                {
                    'AllowFromPublic': True,
                    'Rules': [
                        {
                            'Resource': ['collection/' + collection_name],
                            'ResourceType': 'collection'
                        },
                        {
                            'Resource': ['collection/' + collection_name],
                            'ResourceType': 'dashboard'
                        }
                    ]
                }
            ]),
        type='network'
    )

    # create access policy
    oss_client.create_access_policy(
            name=access_policy_name,
            # arn:aws:iam::718294827409:role/WSParticipantRole
            policy=json.dumps(
                [
                    {
                        'Rules': [
                            {
                                'Resource': ['collection/' + collection_name],
                                'Permission': [
                                    'aoss:CreateCollectionItems',
                                    'aoss:DeleteCollectionItems',
                                    'aoss:UpdateCollectionItems',
                                    'aoss:DescribeCollectionItems'],
                                'ResourceType': 'collection'
                            },
                            {
                                'Resource': ['index/' + collection_name + '/*'],
                                'Permission': [
                                    'aoss:CreateIndex',
                                    'aoss:DeleteIndex',
                                    'aoss:UpdateIndex',
                                    'aoss:DescribeIndex',
                                    'aoss:ReadDocument',
                                    'aoss:WriteDocument'],
                                'ResourceType': 'index'
                            }],
                        'Principal': [identity, workshop_role, get_current_role_arn()],
                        'Description': 'Easy data policy'}
                ]),
            type='data'
        )

    # create collection and policies
    response = oss_client.create_collection(
        name=collection_name,
        type='VECTORSEARCH'
    )

def get_opensearch_client(collection_name):
    c = get_collection(collection_name)
    if not c:
        raise f'collection {collection_name} not found'
    return OpenSearch(
        hosts=[{'host': c['collectionEndpoint'].replace('https://', ''), 'port': 443}],
        http_auth=AWSV4SignerAuth(session.get_credentials(), session.region_name, 'aoss'),
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection,
        timeout=600
    )


class BedrockEncoder:
    score_threshold = 0.3

    def __init__(self):
        pass

    def __call__(self, docs, model_kwargs = None):
        return [get_text_embedding(doc) for doc in docs]

#--------------------------------------------------------------------------------------------

def display_json_response(response, metrics=None):
    if metrics:
      print(f"time: {metrics['time']:.2f}s,   cost: ${metrics['cost']:.4f}")
    try:
        data = json.loads(response)
        display(HTML("<b>Valid JSON response</b><br>"))
        display(Markdown(f"```json\n{json.dumps(data, indent=4, ensure_ascii=False)}\n```"))
        return True
    except json.JSONDecodeError:
        display(HTML("<b>Invalid JSON response</b><br>"))
        txt = "> " + "\n> ".join(response.split("\n"))
        display(Markdown(txt))
        return False

def display_result(hits, n=3, clear=True):
    if clear: clear_output()
    for hit in hits[0:n]:
        data = hit['_source']
        html_content = f"""
            <h1 style="text-align: left">{data['project']}</h1>
            <table>
                <tr style="text-align: left"><td>Kunde</td><td>{data['customer']}</td></tr>
                <tr style="text-align: left"><td>Ort</td><td>{", ".join(data['geography'])}</td></tr>
                <tr style="text-align: left"><td>Datum</td><td>{data['creation_date']}</td></tr>
            </table>
            <p style="text-align: left; width: 400px">{data['description']}</p>
            <p style="text-align: left; width: 400px">{", ".join(data['keywords'])}</p>
            <p style="text-align: left; width: 400px">Notizen: {data['notes']}</p>
            <p style="text-align: left; width: 400px">Metadata: <a href="{data['meta_filename']}.txt">open</a></p>
        """
        display(HTML(f"""
            <table>
            <tr>
                <td style="border:none">
                    <img src="{data['meta_filename']}" width="300"/>
                </td>
                <td style="border:none; vertical-align:top">
                    {html_content}
                </td>
            </tr>
            </table>
        """))
#--------------------------------------------------------------------------------------------

class AWSConnectionError(Exception):
    """Custom exception for AWS connection issues"""
    pass

#--- connect to AWS using defaults, region is us-west-2

try:
    session = boto3.Session(region_name='us-west-2')
    print(f'The notebook will use aws services hosted in {session.region_name} region')
    bedrock_client = session.client('bedrock')
    bedrock_runtime_client = session.client('bedrock-runtime')
    sts_client = session.client('sts')
    s3_client = session.client('s3')
    oss_client = session.client('opensearchserverless')
    translate = boto3.client('translate')
    print(f'Current role arn is {get_current_role_arn()}')
except Exception as e:
    raise AWSConnectionError('No valid AWS credentials found') from None


