import { createClient } from 'redis'

const DEFULT_EXPRETION_TIME = 60 * 60 * 24 * 30

const client = (async function () {
    const client = createClient()

    client.on('error', err => console.log('Redis Client Error', err))

    client.on('connect', msg => console.log("Client connected to Redis..."))

    await client.connect()
    return client
})()

export async function getToken(email: string) {
    return (await client).get(email)
}

export async function addToken(email: string, token: string) {
    (await client).setEx(email, DEFULT_EXPRETION_TIME, token)
}

export async function delToken(email: string) {
    (await client).del(email)
}
