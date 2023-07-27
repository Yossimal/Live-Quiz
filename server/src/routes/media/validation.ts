import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";

const uploadQuizImage = z.object({
  quizId: z.number().int().positive(),
  extention: z.string().regex(/(png|jpg|jpeg|gif)/),
});

export function uploadQuizImageValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { quizId } = uploadQuizImage.parse(req.body);
    res.locals.quizId = quizId;
    next();
  } catch (error: ZodError | unknown) {
    if (error instanceof ZodError) {
      if (error.errors[0].path[0] === "extention") {
        return res.status(400).send({
          error:
            "The file extention is not valid. The valid options are (png, jpg, jpegm, gif).",
        });
      }
      res
        .status(400)
        .send({ error: "There was an error processing the request data." });
    }
  }
}
