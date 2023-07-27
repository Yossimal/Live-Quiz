import { PrismaClient } from "@prisma/client";
import express from "express";
import { getMulter } from "../../middlewares/multer";
import { MediaType } from "../../gameOnline/types";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/quiz/:id", getMulter("images/quiz").single("image"), async (req, res) => {
  const quizId = parseInt(req.params.id);
  const image = req.file;
  const user = res.locals.user;
  console.log("image", image);
  if (!image) return res.status(400).send({ error: "No image" });

  const media = await prisma.media.create({
    data: {
      quizId,
      type: MediaType.IMAGE,
      path: image.path,
      ownerId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!media?.id) {
    return res.status(500).send({ error: "Something went wrong" });
  }
  const results = await prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      imageId: media.id,
    },
    select: {
      imageId: true,
      id: true,
    },
  });

  res.send({ ok: true });
}
);


export default router;
