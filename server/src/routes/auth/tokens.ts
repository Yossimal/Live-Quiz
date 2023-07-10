import { createClient } from 'redis';

const client = (async function () {
    const client = createClient();

    client.on('error', err => console.log('Redis Client Error', err));

    client.on('connect', msg => console.log("Client connected to Redis..."))

    await client.connect();
    return client;
})();

export async function getToken(email: string) {
    return (await client).get(email)
}

export async function addToken(email: string, token: string) {
    (await client).set(email, token);
}

export async function delToken(email: string) {
    (await client).del(email);
}
