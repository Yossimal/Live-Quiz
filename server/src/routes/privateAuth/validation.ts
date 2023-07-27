import { PASSWORD_REGEX } from "../auth/validation";
import z, { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const changePasswordSchema = z.object({
  oldPassword: z.string().regex(PASSWORD_REGEX),
  newPassword: z.string().regex(PASSWORD_REGEX),
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export function changePasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = changePasswordSchema.parse(req.body);
    res.locals.changePasswordData = data as ChangePasswordData;
    next();
  } catch (error: ZodError | unknown) {
    if (error instanceof ZodError) {
      if (error.errors[0].path[0] === "oldPassword") {
        return res.status(400).send({ error: "Invalid old password!" });
      }
      if (error.errors[0].path[0] === "newPassword") {
        return res.status(400).send({ error: "Invalid new password!" });
      }
    }
  }
}
const updateUserDataSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
});

export type UpdateUserData = z.infer<typeof updateUserDataSchema>;

export function updateUserDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = updateUserDataSchema.parse(req.body);
    res.locals.updateUserData = data as UpdateUserData;
    next();
  } catch (error: ZodError | unknown) {
    if (error instanceof ZodError) {
      if (error.errors[0].path[0] === "firstName") {
        return res.status(400).send({ error: "Invalid first name!" });
      }
      if (error.errors[0].path[0] === "lastName") {
        return res.status(400).send({ error: "Invalid last name!" });
      }
      if (error.errors[0].path[0] === "email") {
        return res.status(400).send({ error: "Invalid email!" });
      }
    }
    res.status(500).send({ error: "An unexpected error occured" });
  }
}
