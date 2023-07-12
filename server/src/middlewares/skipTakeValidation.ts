import z, { ZodError } from 'zod';
import { Request, Response, NextFunction } from "express";

const skipTakeSchema = z.object({
    skip: z.number().int().default(0),
    take: z.number().int().positive().default(10)
});

//export const SkipTakeType = z.infer<typeof skipTakeSchema>;

export default function skipTakeValidation(req: Request, res: Response, next: NextFunction) {
    try {
        const { skip, take } = skipTakeSchema.parse(req.query);
        res.locals.skipTake = { skip, take };
        next();
    } catch (err: ZodError | unknown) {
        res.sendStatus(400);
    }
}