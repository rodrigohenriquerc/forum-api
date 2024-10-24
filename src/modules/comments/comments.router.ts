import { Router } from "express";
import { Comment, CommentVote } from "../../models";
import { authMiddleware } from "../auth/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import {
  commentCreationValidator,
  commentDeletionValidator,
  commentDownvoteValidator,
  commentsRequestValidator,
  commentUpdateValidator,
  commentUpvoteValidator,
} from "./comments.validators";

export const commentsRouter = Router();

commentsRouter.get(
  "/posts/:postId/comments",
  authMiddleware,
  commentsRequestValidator,
  async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.findAll({ where: { postId } });

    res.json({ data: comments });
  }
);

commentsRouter.post(
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

commentsRouter.delete(
  "/posts/:postId/comments/:commentId/delete",
  authMiddleware,
  commentDeletionValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId, commentId } = req.params;

    await Comment.destroy({ where: { id: commentId, postId, userId } });

    res.status(200).json({ message: "The comment was removed." });
  }
);

commentsRouter.put(
  "/posts/:postId/comments/:commentId/update",
  authMiddleware,
  commentUpdateValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId, commentId } = req.params;
    const { content } = req.body;

    await Comment.update(
      { content },
      { where: { id: commentId, postId, userId } }
    );

    res.status(200).json({ message: "The comment was updated." });
  }
);

commentsRouter.post(
  "/posts/:postId/comments/:commentId/upvote",
  authMiddleware,
  commentUpvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { commentId, postId } = req.params;

    const currentVote = await CommentVote.findOne({
      where: { commentId, postId, userId },
    });

    if (!currentVote) {
      await CommentVote.create({ userId, commentId, postId, choice: "up" });
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

commentsRouter.post(
  "/posts/:postId/comments/:commentId/downvote",
  authMiddleware,
  commentDownvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { commentId, postId } = req.params;

    const currentVote = await CommentVote.findOne({
      where: { commentId, postId, userId },
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
