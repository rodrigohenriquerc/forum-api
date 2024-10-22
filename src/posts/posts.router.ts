import { Router } from "express";
import { Post } from "../models";
import { authMiddleware } from "../auth/auth.middleware";
import { JwtPayload } from "jsonwebtoken";

export const postsRouter = Router();

postsRouter.get("/posts", async (_req, res) => {
  const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

  res.json({ data: posts });
});

postsRouter.post("/posts/create", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const { title, content } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required." });
  } else if (!content) {
    res.status(400).json({ message: "Content is required." });
  } else {
    const newPost = await Post.create({ title, content, userId });

    res.json({ data: newPost });
  }
});
