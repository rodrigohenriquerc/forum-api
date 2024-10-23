import { Router } from "express";
import { Post, Comment, PostVote, CommentVote } from "../models";
import { authMiddleware } from "../auth/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import {
  commentCreationValidator,
  commentDeletionValidator,
  commentDownvoteValidator,
  commentsRequestValidator,
  commentUpdateValidator,
  commentUpvoteValidator,
  postCreationValidator,
  postDeletionValidator,
  postDownvoteValidator,
  postUpdateValidator,
  postUpvoteValidator,
} from "./posts.validators";

export const postsRouter = Router();

postsRouter.get("/posts", async (_req, res) => {
  const posts = await Post.findAll({ order: [["createdAt", "DESC"]] });

  res.json({ data: posts });
});

postsRouter.post(
  "/posts/create",
  authMiddleware,
  postCreationValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { title, content } = req.body;

    const newPost = await Post.create({ title, content, userId });

    res.json({ data: newPost });
  }
);

postsRouter.delete(
  "/posts/:postId/delete",
  authMiddleware,
  postDeletionValidator,
  async (req, res) => {
    const { postId } = req.params;

    await Post.destroy({ where: { id: postId } });

    res.status(200).json({ message: "The post was removed." });
  }
);

postsRouter.put(
  "/posts/:postId/update",
  authMiddleware,
  postUpdateValidator,
  async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    await Post.update({ title, content }, { where: { id: postId } });

    res.status(200).json({ message: "The post was updated." });
  }
);

postsRouter.post(
  "/posts/:postId/upvote",
  authMiddleware,
  postUpvoteValidator,
  async (req, res) => {
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
  }
);

postsRouter.post(
  "/posts/:postId/downvote",
  authMiddleware,
  postDownvoteValidator,
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

postsRouter.get(
  "/posts/:postId/comments",
  commentsRequestValidator,
  async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.findAll({ where: { postId } });

    res.json({ data: comments });
  }
);

postsRouter.post(
  "/posts/:postId/comments/create",
  authMiddleware,
  commentCreationValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;
    const { content } = req.body;

    const newComment = await Comment.create({ content, postId, userId });

    res.json({ data: newComment });
  }
);

postsRouter.delete(
  "/posts/:postId/comments/:commentId/delete",
  authMiddleware,
  commentDeletionValidator,
  async (req, res) => {
    const { postId, commentId } = req.params;

    await Comment.destroy({ where: { id: commentId, postId } });

    res.status(200).json({ message: "The comment was removed." });
  }
);

postsRouter.put(
  "/posts/:postId/comments/:commentId/update",
  authMiddleware,
  commentUpdateValidator,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;

    await Comment.update({ content }, { where: { id: commentId, postId } });

    res.status(200).json({ message: "The comment was updated." });
  }
);

postsRouter.post(
  "/posts/:postId/comments/:commentId/upvote",
  authMiddleware,
  commentUpvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { commentId, postId } = req.params;

    const currentVote = await CommentVote.findOne({
      where: { commentId, postId },
    });

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
  }
);

postsRouter.post(
  "/posts/:postId/comments/:commentId/downvote",
  authMiddleware,
  commentDownvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { commentId, postId } = req.params;

    const currentVote = await CommentVote.findOne({
      where: { commentId, postId },
    });

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
  }
);
