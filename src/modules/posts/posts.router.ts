import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import {
  postCreationValidator,
  postDeletionValidator,
  postDownvoteValidator,
  postUpdateValidator,
  postUpvoteValidator,
} from "./posts.validators";
import {
  createPost,
  deletePost,
  downvotePost,
  findAllPosts,
  updatePost,
  upvotePost,
} from "../../repositories/post.repository";

export const postsRouter = Router();

postsRouter.get("/posts", authMiddleware, async (req, res) => {
  const posts = await findAllPosts();

  res.json({ data: posts });
});

postsRouter.post(
  "/posts/create",
  authMiddleware,
  postCreationValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { title, content } = req.body;

    await createPost({ title, content, userId });

    res.sendStatus(201);
  }
);

postsRouter.delete(
  "/posts/:postId/delete",
  authMiddleware,
  postDeletionValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;

    await deletePost({ id: Number(postId), userId });

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

    await updatePost({ id: Number(postId), title, content, userId });

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

    await upvotePost({ postId: Number(postId), userId });

    res.sendStatus(204);
  }
);

postsRouter.post(
  "/posts/:postId/downvote",
  authMiddleware,
  postDownvoteValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { postId } = req.params;

    await downvotePost({ postId: Number(postId), userId });

    res.sendStatus(204);
  }
);
