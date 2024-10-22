import { Router } from "express";
import { Post, Comment, PostVote, CommentVote } from "../models";
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

postsRouter.delete(
  "/posts/:postId/delete",
  authMiddleware,
  async (req, res) => {
    const { postId } = req.params;

    await Post.destroy({ where: { id: postId } });

    res.status(200).json({ message: "The post was removed." });
  }
);

postsRouter.put("/posts/:postId/update", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  await Post.update({ title, content }, { where: { id: postId } });

  res.status(200).json({ message: "The post was updated." });
});

postsRouter.post("/posts/:postId/upvote", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const { postId } = req.params;

  const currentVote = await PostVote.findOne({ where: { postId } });

  if (!currentVote) {
    await PostVote.create({ userId, postId, choice: "up" });
    res.status(200).json({ message: "The upvote has been registered." });
  } else if (currentVote.choice === "up") {
    await currentVote.destroy();
    res.status(200).json({ message: "The upvote has been removed." });
  } else {
    await currentVote.update({ choice: "up" });
    res.status(200).json({
      message: "The change from downvote to upvote has been registered.",
    });
  }
});

postsRouter.post(
  "/posts/:postId/downvote",
  authMiddleware,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;

    const currentVote = await PostVote.findOne({ where: { postId } });

    if (!currentVote) {
      await PostVote.create({ userId, postId, choice: "down" });
      res.status(200).json({ message: "The downvote has been registered." });
    } else if (currentVote.choice === "down") {
      await currentVote.destroy();
      res.status(200).json({ message: "The downvote has been removed." });
    } else {
      await currentVote.update({ choice: "down" });
      res.status(200).json({
        message: "The change from upvote to downvote has been registered.",
      });
    }
  }
);

postsRouter.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.findAll({ where: { postId } });

  res.json({ data: comments });
});

postsRouter.post(
  "/posts/:postId/comments/create",
  authMiddleware,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;
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

postsRouter.post("/posts/:postId/comments/:commentId/upvote", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const { commentId } = req.params;

  const currentVote = await CommentVote.findOne({ where: { commentId } });

  if (!currentVote) {
    await CommentVote.create({ userId, commentId, choice: "up" });
    res.status(200).json({ message: "The upvote has been registered." });
  } else if (currentVote.choice === "up") {
    await currentVote.destroy();
    res.status(200).json({ message: "The upvote has been removed." });
  } else {
    await currentVote.update({ choice: "up" });
    res.status(200).json({
      message: "The change from downvote to upvote has been registered.",
    });
  }
});

postsRouter.post("/posts/:postId/comments/:commentId/downvote", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const { commentId } = req.params;

  const currentVote = await CommentVote.findOne({ where: { commentId } });

  if (!currentVote) {
    await CommentVote.create({ userId, commentId, choice: "down" });
    res.status(200).json({ message: "The downvote has been registered." });
  } else if (currentVote.choice === "down") {
    await currentVote.destroy();
    res.status(200).json({ message: "The downvote has been removed." });
  } else {
    await currentVote.update({ choice: "down" });
    res.status(200).json({
      message: "The change from upvote to downvote has been registered.",
    });
  }
});
