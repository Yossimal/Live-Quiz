import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import * as v from "./validation";
import { hasePassword, verifyPassword } from "../auth/safePassword";

const router = Router();
const prisma = new PrismaClient();

router.post("/changePassword", v.changePasswordValidation, async (req, res) => {
  try {
    const { oldPassword, newPassword }: v.ChangePasswordData =
      res.locals.changePasswordData;
    const user = await prisma.user.findUnique({
      where: {
        id: res.locals.user.id,
      },
    });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    console.log(
      oldPassword,
      hasePassword(oldPassword),
      user.password,
      hasePassword(newPassword) == user.password
    );
    if (!verifyPassword(oldPassword, user.password)) {
      return res.status(400).send({ error: "Old password not match" });
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hasePassword(newPassword),
      },
    });
    res.status(200).send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

router.post("/updateProfile", v.updateUserDataValidation, async (req, res) => {
  try {
    const { firstName, lastName, email }: v.UpdateUserData =
      res.locals.updateUserData;
    const user = await prisma.user.update({
      where: {
        id: res.locals.user.id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
