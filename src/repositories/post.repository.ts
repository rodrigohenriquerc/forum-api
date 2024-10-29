import { Post } from "../models/post.model";
import { PostVote } from "../models/post-vote.model";

interface CreatePostDto {
  title: string;
  content: string;
  userId: number;
}

interface UpdatePostDto {
  id: number;
  title: string;
  content: string;
  userId: number;
}

interface DeletePostDto {
  id: number;
  userId: number;
}

interface VotePostDto {
  postId: number;
  userId: number;
}

export const findAllPosts = async () => {
  const posts = await Post.findAll({
    order: [["createdAt", "DESC"]],
  });

  return posts;
};

export const createPost = async (dto: CreatePostDto) => {
  await Post.create({
    title: dto.title,
    content: dto.content,
    userId: dto.userId,
  });
};

export const updatePost = async (dto: UpdatePostDto) => {
  await Post.update(
    { title: dto.title, content: dto.content },
    { where: { id: dto.id, userId: dto.userId } }
  );
};

export const deletePost = async (dto: DeletePostDto) => {
  await Post.destroy({ where: { id: dto.id, userId: dto.userId } });
};

export const upvotePost = async (dto: VotePostDto) => {
  const currentVote = await PostVote.findOne({
    where: { postId: dto.postId, userId: dto.userId },
  });

  if (!currentVote) {
    await PostVote.create({
      userId: dto.userId,
      postId: dto.postId,
      choice: "up",
    });
    return;
  }

  if (currentVote.choice === "up") {
    await currentVote.destroy();
    return;
  }

  await currentVote.update({ choice: "up" });
};

export const downvotePost = async (dto: VotePostDto) => {
  const currentVote = await PostVote.findOne({
    where: { postId: dto.postId, userId: dto.userId },
  });

  if (!currentVote) {
    await PostVote.create({
      userId: dto.userId,
      postId: dto.postId,
      choice: "down",
    });
    return;
  }

  if (currentVote.choice === "down") {
    await currentVote.destroy();
    return;
  }

  await currentVote.update({ choice: "down" });
};
