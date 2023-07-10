import dotenv from 'dotenv'
dotenv.config()

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403)

        res.locals.user = user
        next()
    })
}
