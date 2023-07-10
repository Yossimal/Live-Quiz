import z, { ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

const singupSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    birthday: z.coerce.date(),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
})
export type SingupData = z.infer<typeof singupSchema>

export function singupValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const singupValues = singupSchema.parse(req.body)
        res.locals.singupValues = singupValues as SingupData
        next()
    } catch (error: ZodError | any) {
        res.status(400).send({ error: error.errors })
    }
}

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
export type LoginData = z.infer<typeof LoginSchema>

export function loginValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const loginValues = LoginSchema.parse(req.body)
        res.locals.loginValues = loginValues as LoginData
        next()
    } catch (error: ZodError | unknown) {
        res.status(400).send({ error: (error as ZodError).errors })
    }
}

const tokenSchema = z.object({
    email: z.string().email(),
    token: z.string()
})
export type RefreshTokenData = z.infer<typeof tokenSchema>

export function tokenValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = tokenSchema.parse(req.body)
        res.locals.auth = auth as RefreshTokenData
        next()
    } catch (error: ZodError | unknown) {
        res.status(400).send({ error: (error as ZodError).errors })
    }
}

const logoutSchema = z.object({
    email: z.string().email()
})

export function logoutValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const email = logoutSchema.parse(req.params)
        res.locals.email = email.email
        next()
    } catch (error: ZodError | unknown) {
        res.status(400).send({ error: (error as ZodError).errors })
    }
}






