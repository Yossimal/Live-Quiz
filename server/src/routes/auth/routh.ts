import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { User } from '@prisma/client'
import { hasePassword, verifyPassword } from './safePassword'
import * as v from './validation'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import jwt from 'jsonwebtoken'
import { getToken, addToken, delToken } from './tokens'


const prisma = new PrismaClient()

const router = express.Router()

type UserTokenData = { id: number, email: string }

function getTokenData<T extends UserTokenData>({ id, email }: T): UserTokenData {
    return { id, email }
}

function generateAccessToken<T extends UserTokenData>(user: T) {
    const accessToken = jwt.sign(getTokenData(user), process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '10s' })
    return accessToken
}

router.post('/login', v.loginValidation, async (req, res) => {
    const { email, password } = res.locals.loginValues as v.LoginData
    console.log(email, password)
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        return res.status(404).send({ error: 'User not found' })
    }
    if (!verifyPassword(password, user.password)) {
        return res.status(403).send({ error: 'Invalid email or password' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(getTokenData(user), process.env.REFRESH_TOKEN_SECRET!)

    addToken(email, refreshToken)


    res.send({ user, accessToken, refreshToken })
});

router.post('/token', v.tokenValidation, async (req, res) => {
    const auth = res.locals.auth as v.RefreshTokenData
    console.log(auth)
    const token = await getToken(auth.email)
    if (token !== auth.token) return res.sendStatus(403) // potential security issue

    jwt.verify(auth.token, process.env.REFRESH_TOKEN_SECRET!, (err: any, user: unknown) => {
        if (err) return res.sendStatus(403)

        const accessToken = generateAccessToken(user as UserTokenData)

        res.send({ accessToken })
    });
});

router.delete('/logout/:email', v.logoutValidation, (req, res) => {
    // refreshTokens = refreshTokens.filter(token => token !== res.locals.token);
    delToken(res.locals.email)
    res.sendStatus(204)
});

router.post('/singup', v.singupValidation, async (req, res) => {
    const { firstName, lastName, email, password, birthday } = res.locals.singupValues as v.SingupData
    const hase = hasePassword(password)
    try {
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                birthday,
                password: hase
            }
        });


        res.send(user)
    }
    catch (err: PrismaClientKnownRequestError | any) {
        const prismaError = err as PrismaClientKnownRequestError
        if (prismaError?.code === 'P2002') {
            res.status(400).send({ error: 'Email already exists' })
        }
        else {
            res.status(500).send({ error: 'Something went wrong' })
        }
    }
})

router.get('/users', async (req, res) => {
    const users = await prisma.user.findMany()
    res.send(users)
})

export default router