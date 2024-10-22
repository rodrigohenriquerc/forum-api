import { Router } from "express";
import { Post, Comment } from "../models";
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

postsRouter.delete("/posts/:id/delete", authMiddleware, async (req, res) => {
  const { id: postId } = req.params;

  await Post.destroy({ where: { id: postId } });

  res.status(200).json({ message: "The post was removed." });
});

postsRouter.put("/posts/:id/update", authMiddleware, async (req, res) => {
  const { id: postId } = req.params;
  const { title, content } = req.body;

  await Post.update({ title, content }, { where: { id: postId } });

  res.status(200).json({ message: "The post was updated." });
});

postsRouter.get("/posts/:id/comments", async (req, res) => {
  const { id: postId } = req.params;

  const comments = await Comment.findAll({ where: { postId } });

  res.json({ data: comments });
});

postsRouter.post(
  "/posts/:id/comments/create",
  authMiddleware,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { id: postId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Content is required." });
    } else {
      const newComment = await Comment.create({ content, postId, userId });

      res.json({ data: newComment });
    }
  }
);

postsRouter.delete(
  "/posts/:postId/comments/:commentId/delete",
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;

    await Comment.destroy({ where: { id: commentId, postId } });

    res.status(200).json({ message: "The comment was removed." });
  }
);

postsRouter.put(
  "/posts/:postId/comments/:commentId/update",
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    await Comment.update({ content }, { where: { id: commentId, postId } });

    res.status(200).json({ message: "The comment was updated." });
  }
);
