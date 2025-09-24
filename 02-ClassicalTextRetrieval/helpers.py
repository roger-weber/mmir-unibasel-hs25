from IPython.display import display, Markdown
from tabulate import tabulate
from itertools import islice
import re
from collections import Counter
from nltk.stem import PorterStemmer
from PyPDF2 import PdfReader
from unidecode import unidecode


stopwords = { 
    "english": {'a',  'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an', 
                'and', 'any', 'are', 'aren', "aren't", 'as', 'at', 'be', 'because', 'been', 
                'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'couldn', 
                "couldn't", 'd', 'did', 'didn', "didn't", 'do', 'does', 'doesn', "doesn't", 
                'doing', 'don', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 
                'further', 'had', 'hadn', "hadn't", 'has', 'hasn', "hasn't", 'have', 'haven', 
                "haven't", 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 
                'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', "isn't", 'it', "it's", 
                'its', 'itself', 'just', 'll', 'm', 'ma', 'me', 'mightn', "mightn't", 'more', 
                'most', 'mustn', "mustn't", 'my', 'myself', 'needn', "needn't", 'no', 'nor', 
                'not', 'now', 'o', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 
                'ours', 'ourselves', 'out', 'over', 'own', 're', 's', 'same', 'shan', "shan't", 
                'she', "she's", 'should', "should've", 'shouldn', "shouldn't", 'so', 'some', 
                'such', 't', 'than', 'that', "that'll", 'the', 'their', 'theirs', 'them', 
                'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 
                'to', 'too', 'under', 'until', 'up', 've', 'very', 'was', 'wasn', "wasn't", 
                'we', 'were', 'weren', "weren't", 'what', 'when', 'where', 'which', 'while', 
                'who', 'whom', 'why', 'will', 'with', 'won', "won't", 'wouldn', "wouldn't", 
                'y', 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 
                'yourselves'}
}


def print_table(rows: list[list[str]], headers: list[str], max_rows: int = 100, format: str = 'pipe'):
    if not rows or not headers: return
    if format == 'text':
        print(tabulate(islice(rows, max_rows), headers, tablefmt='github'))
    else:
        display(Markdown(tabulate(islice(rows, max_rows), headers, tablefmt=format)))

def extract_text_from_pdf(file_name: str) -> str:
    pages = []

    def visitor_text(text, cm, tm, fontDict, fontSize):
        y = tm[5]
        if y > 20 and len(text) > 0:
            # replace \n and multiple spaces (\s*) with a single space
            text = text.replace("\n", " ")
            text = re.sub(r'\[\d+\]|➢|•', '', text)
            parts.append(text)

    # read the PDF and extract all texts (do some post-processing with above function)
    reader = PdfReader(file_name)
    for page in reader.pages:
        parts = []
        page.extract_text(visitor_text=visitor_text)
        pages.append(re.sub(r'\s+',' ', " ".join(parts)).strip())

    # merge text blocks and clean-up
    return pages

def bag_of_words(tokens):
    return dict(Counter(tokens))

def set_of_words(tokens):
    return set(tokens)

def tokenize(text: str) -> list[str]:
    text = re.sub(r'[^\w\-]+', ' ', text)
    tokens = []
    for token in text.split(' '):
        token = unidecode(token.strip().lower())
        if len(token) < 2: continue
        if not(re.match(r'^[a-zA-Z][\w\-\.]*$', token)): continue
        tokens.append(token)
    return tokens

porter_stemmer = PorterStemmer()

def reduce_to_stems(tokens):
    return list(map(lambda token: porter_stemmer.stem(token), tokens))

def eliminate_stopwords(tokens):
    return [token for token in tokens if not(token in stopwords['english'])]
