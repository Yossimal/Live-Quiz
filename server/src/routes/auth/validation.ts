import z, { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const singupSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  birthday: z.coerce.date(),
  password: z.string().regex(PASSWORD_REGEX),
});
export type SingupData = z.infer<typeof singupSchema>;

export function singupValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const singupValues = singupSchema.parse(req.body);
    res.locals.singupValues = singupValues as SingupData;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginData = z.infer<typeof LoginSchema>;

export function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const loginValues = LoginSchema.parse(req.body);
    res.locals.loginValues = loginValues as LoginData;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    res.status(400).send({ error: (error as ZodError).errors });
  }
}

const tokenSchema = z.object({
  token: z.string(),
});
export type RefreshTokenData = z.infer<typeof tokenSchema>;

export function tokenValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth = tokenSchema.parse(req.body);
    res.locals.auth = auth as RefreshTokenData;
    next();
  } catch (error: ZodError | unknown) {
    //TODO :: send clear string to the end user with the error!!!!!!!!!!
    return res.status(400).send({ error: (error as ZodError).errors });
  }
}

const logoutSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LogoutData = z.infer<typeof logoutSchema>;

export function logoutValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tokens: LogoutData = logoutSchema.parse(req.body);
    res.locals.tokens = tokens;
    next();
  } catch (error: ZodError | unknown) {
    // //TODO :: send clear string to the end user with the error!!!!!!!!!!
    // if (error instanceof ZodError) {
    //   if (error.errors[0].path[0] === "accessToken") {
    //     return res.status(400).send({ error: "Invalid access token!" });
    //   }
    //   if (error.errors[0].path[0] === "refreshToken") {
    //     return res.status(400).send({ error: "Invalid refresh token!" });
    //   }
    // }
    // res.status(500).send({ error: "An unexpected error occured" });

    return res.status(400).send({ error: (error as ZodError).errors });
  }
}

export function emailVarificationValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = z.string().parse(req.body.token);
    res.locals.token = token;
    next();
  } catch (error: ZodError | unknown) {
    res.status(400).send({
      error:
        "There was an error in the token, try to login again to get new token.",
    });
  }
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export function forgotPasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    res.locals.email = email;
    next();
  } catch (error: ZodError | unknown) {
    console.log(error);
    res.status(400).send({ error: "The email address is not valid" });
  }
}

const resetPasswordSchema = z.object({
  password: z.string().regex(PASSWORD_REGEX),
  token: z.string(),
});

export function resetPasswordValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, token } = resetPasswordSchema.parse(req.body);
    res.locals.password = password;
    res.locals.token = token;
    next();
  } catch (error: ZodError | unknown) {
    if (error instanceof ZodError) {
      if (error.errors[0].path[0] === "password") {
        return res
          .status(400)
          .send({ error: "Invalid password!", fetal: false });
      }
      if (error.errors[0].path[0] === "token") {
        return res.status(400).send({
          error:
            "The link you got is not valid. Please ask again for password reset.",
          fetal: true,
        });
      }
    }
    res.status(500).send({ error: "An unexpected error occured" });
  }
}
