import { PrismaClient } from "@prisma/client";
import express from "express";


const router = express.Router();
const prisma = new PrismaClient();


router.get("/:id", async (req, res) => {
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
      console.log(`\\${media.path}`);
      res.sendFile(`\\${media.path}`, { root: "./" });
    } catch (error) {
        console.log(error);
      res.status(500).send({ error: "Something went wrong" });
    }
  });
  

  export default router;