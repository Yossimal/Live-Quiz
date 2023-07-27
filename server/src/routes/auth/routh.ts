import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import { hasePassword, verifyPassword } from "./safePassword";
import * as v from "./validation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  deleteAcessToken,
  deleteRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
} from "./tokens";
import sendEmail from "../../lib/email/sendEmail";
import varificationEmailTemplate from "../../templates/emails/varification/varification";
import resetPasswordTemplate from "../../templates/emails/resetPassword/resetPassword";

const prisma = new PrismaClient();

const router = express.Router();

type UserTokenData = { id: number; email: string };

function getTokenData<T extends UserTokenData>({
  id,
  email,
}: T): UserTokenData {
  return { id, email };
}

async function sendVarificationEmail(user: User): Promise<void> {
  console.log("sendVarificationEmail");
  const varificationToken = await prisma.emailValidationTokens.create({
    data: {
      userId: user.id,
    },
    select: {
      token: true,
    },
  });
  const emailData = await varificationEmailTemplate(
    `${user.firstName} ${user.lastName}`,
    varificationToken.token
  );
  sendEmail(user.email, emailData);
}

router.post("/login", v.loginValidation, async (req, res) => {
  const { email, password } = res.locals.loginValues as v.LoginData;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(403).send({ error: "Invalid email or password" });
  }

  if (!user.varified) {
    await sendVarificationEmail(user);
    return res.status(403).send({ error: "Email not varified" });
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  res.send({ user, accessToken, refreshToken });
});

router.post("/token", v.tokenValidation, async (req, res) => {
  const auth = res.locals.auth as v.RefreshTokenData;
  const refreshToken = auth.token;
  const accessToken = await refreshAccessToken(refreshToken);

  if (!accessToken) return res.status(403).send({ error: "Invalid token" });

  res.send({ accessToken });
});

router.post("/logout", v.logoutValidation, (req, res) => {
  const tokens = res.locals.tokens as v.LogoutData;
  deleteAcessToken(tokens.accessToken);
  deleteRefreshToken(tokens.refreshToken);
  res.sendStatus(204);
});

router.post("/signup", v.singupValidation, async (req, res) => {
  const { firstName, lastName, email, password, birthday } = res.locals
    .singupValues as v.SingupData;
  const hase = hasePassword(password);
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        birthday,
        password: hase,
      },
    });
    sendVarificationEmail(user);

    res.send(user);
  } catch (err: PrismaClientKnownRequestError | unknown) {
    const prismaError = err as PrismaClientKnownRequestError;
    if (prismaError?.code === "P2002") {
      res.status(400).send({ error: "Email already exists" });
    } else {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
});

router.post("/varifyEmail", v.emailVarificationValidation, async (req, res) => {
  const token: string = res.locals.token;
  try {
    const tokenData = await prisma.emailValidationTokens.findFirst({
      where: {
        token,
      },
    });
    if (!tokenData) {
      return res.status(404).send({ error: "Token not found" });
    }
    //if the token is expired -> send new token
    if (tokenData.expiresAt < new Date()) {
      const user = await prisma.user.findUnique({
        where: {
          id: tokenData.userId,
        },
      });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      sendVarificationEmail(user);
      return res.status(400).send({ error: "Token expired" });
    }
    //if the token is valid -> update user
    const user = await prisma.user.update({
      where: {
        id: tokenData.userId,
      },
      data: {
        varified: true,
      },
      select: {
        varified: true,
      },
    });
    console.log(user);
    return res.status(200).send({ ok: true });
  } catch (err: PrismaClientKnownRequestError | any) {
    const prismaError = err as PrismaClientKnownRequestError;
    if (prismaError?.code === "P2002") {
      return res.status(400).send({ error: "Email already exists" });
    } else {
      return res.status(500).send({ error: "Something went wrong" });
    }
  }
});

router.post("/forgotPassword", v.forgotPasswordValidation, async (req, res) => {
  try {
    const email: string = res.locals.email;
    //check if the email exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).send({ error: "Email not exists." });
    }
    //create token
    const token = await prisma.passwordResetTokens.create({
      data: {
        userId: user.id,
      },
      select: {
        token: true,
      },
    });
    //send email
    const template = await resetPasswordTemplate(
      `${user.firstName} ${user.lastName}`,
      token.token
    );
    sendEmail(user.email, template);
    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.post("/resetPassword", v.resetPasswordValidation, async (req, res) => {
  try {
    const { token, password } = res.locals;
    //check if the token exists
    const tokenData = await prisma.passwordResetTokens.findFirst({
      where: {
        token,
      },
    });
    if (!tokenData) {
      return res
        .status(404)
        .send({ error: "Password request not found", fetal: true });
    }
    //if the token is expired -> send proper error
    if (tokenData.expiresAt < new Date()) {
      return res.status(400).send({
        error: "Reset password request expired. please ask again for new link.",
        fetal: true,
      });
    }
    //if the token is valid -> update user
    const user = await prisma.user.update({
      where: {
        id: tokenData.userId,
      },
      data: {
        password: hasePassword(password),
      },
    });
    //send success message
    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
