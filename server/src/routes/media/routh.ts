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
  prisma.quiz.update({
    where: {
      id: quizId,
    },
    data: {
      imageId: media.id,
    },
  });

  res.send({ ok: true });
}
);

router.get("media/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const media = await prisma.media.findFirst({
      where: {
        id,
      },
      select: {
        path: true,
      },
    });

    if (!media) return res.status(404).send({ error: "Media not found" });

    res.sendFile(media.path);
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" });
  }
});

export default router;
