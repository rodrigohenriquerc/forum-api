import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import {
  commentCreationValidator,
  commentDeletionValidator,
  commentDownvoteValidator,
  commentsRequestValidator,
  commentUpdateValidator,
  commentUpvoteValidator,
} from "./comments.validators";
import {
  createComment,
  deleteComment,
  downvoteComment,
  findCommentsByPostId,
  updateComment,
  upvoteComment,
} from "../../repositories/comment.repository";

export const commentsRouter = Router();

commentsRouter.get(
  "/posts/:postId/comments",
  authMiddleware,
  commentsRequestValidator,
  async (req, res) => {
    const { postId } = req.params;

    const comments = await findCommentsByPostId(Number(postId));

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

    await createComment({
      content,
      postId: Number(postId),
      userId,
    });

    res.sendStatus(201);
  }
);

commentsRouter.delete(
  "/posts/:postId/comments/:commentId/delete",
  authMiddleware,
  commentDeletionValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId, commentId } = req.params;

    await deleteComment({
      id: Number(commentId),
      postId: Number(postId),
      userId,
    });

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

    await updateComment({
      id: Number(commentId),
      postId: Number(postId),
      content,
      userId,
    });

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

    await upvoteComment({
      commentId: Number(commentId),
      postId: Number(postId),
      userId,
    });

    res.sendStatus(204);
  }
);

commentsRouter.post(
  "/posts/:postId/comments/:commentId/downvote",
  authMiddleware,
  commentDownvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { commentId, postId } = req.params;

    await downvoteComment({
      commentId: Number(commentId),
      postId: Number(postId),
      userId,
    });

    res.sendStatus(204);
  }
);
