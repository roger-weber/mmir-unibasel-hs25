import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime";
import { STS } from "@aws-sdk/client-sts";
import { fromIni, fromEnv, createCredentialChain } from "@aws-sdk/credential-providers";


let clients = new Map()
let profileName = 'default' 
let regionName = undefined


export function setProfile(profile, region) {
    profileName = profile
    if (region) regionName = region
}

export function getBedrockRuntimeClient() {
    const key = 'bedrock-runtime'
    if(clients.has(key)) return clients.get(key)

    // create a new client
    let client = new BedrockRuntime({credentials: fromIni({profile: profileName}), region: regionName})
    clients.set(key, client)
    return client
}

export function getSTSClient() {
    const key = 'sts'
    if(clients.has(key)) return clients.get(key)

    // create a new client
    let client = new STS({credentials: fromIni({profile: profileName}), region: regionName})
    clients.set(key, client)
    return client
}

export async function getCallerIdentity() {
    let response = await getSTSClient().getCallerIdentity()
    let roleArn = response.Arn
    if (roleArn?.includes(':assumed-role/')) {
        const parts = roleArn.split(':');
        const accountId = parts[4];
        const roleName = parts[5].split('/')[1];
        return `arn:aws:iam::${accountId}:role/${roleName}`;
    }
    return roleArn;
}

export async function getRegion() {
    const client = getSTSClient();
    if (client.config.region instanceof Function) {
        return await client.config.region();
    }
    return client.config.region;
}