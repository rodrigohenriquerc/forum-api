import { Router } from "express";
import { Comment, Post, PostVote, User } from "../../models";
import { authMiddleware } from "../auth/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import {
  postCreationValidator,
  postDeletionValidator,
  postDownvoteValidator,
  postUpdateValidator,
  postUpvoteValidator,
} from "./posts.validators";

export const postsRouter = Router();

postsRouter.get("/posts", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
      },
      {
        model: Comment,
      },
      {
        model: PostVote,
      },
    ],
  });

  const data = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    user: {
      id: post.user.id,
      name: post.user.name,
    },
    commentsQuantity: post.comments.length,
    votingBalance: post.votes.reduce(
      (acc, vote) => (vote.choice === "up" ? acc + 1 : acc - 1),
      0
    ),
    myVote: post.votes.find((vote) => vote.userId === userId)?.choice ?? null,
  }));

  res.json({ data });
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
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;

    await Post.destroy({ where: { id: postId, userId } });

    res.status(200).json({ message: "The post was removed." });
  }
);

postsRouter.put(
  "/posts/:postId/update",
  authMiddleware,
  postUpdateValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;
    const { title, content } = req.body;

    await Post.update({ title, content }, { where: { id: postId, userId } });

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

    const currentVote = await PostVote.findOne({ where: { postId, userId } });

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

    const currentVote = await PostVote.findOne({ where: { postId, userId } });

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
