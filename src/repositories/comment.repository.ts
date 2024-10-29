import { CommentVote } from "../models/comment-vote.model";
import { Comment } from "../models/comment.model";

interface CreateCommentDto {
  content: string;
  postId: number;
  userId: number;
}

interface UpdateCommentDto {
  id: number;
  content: string;
  postId: number;
  userId: number;
}

interface DeleteCommentDto {
  id: number;
  postId: number;
  userId: number;
}

interface VoteCommentDto {
  commentId: number;
  postId: number;
  userId: number;
}

export const findCommentsByPostId = async (postId: number) => {
  const comments = await Comment.findAll({ where: { postId } });

  return comments;
};

export const createComment = async (dto: CreateCommentDto) => {
  await Comment.create({
    content: dto.content,
    postId: dto.postId,
    userId: dto.userId,
  });
};

export const updateComment = async (dto: UpdateCommentDto) => {
  await Comment.update(
    { content: dto.content },
    { where: { id: dto.id, postId: dto.postId, userId: dto.userId } }
  );
};

export const deleteComment = async (dto: DeleteCommentDto) => {
  await Comment.destroy({
    where: { id: dto.id, postId: dto.postId, userId: dto.userId },
  });
};

export const upvoteComment = async (dto: VoteCommentDto) => {
  const currentVote = await CommentVote.findOne({
    where: { commentId: dto.commentId, postId: dto.postId, userId: dto.userId },
  });

  if (!currentVote) {
    await CommentVote.create({
      userId: dto.userId,
      commentId: dto.commentId,
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

export const downvoteComment = async (dto: VoteCommentDto) => {
  const currentVote = await CommentVote.findOne({
    where: { commentId: dto.commentId, postId: dto.postId, userId: dto.userId },
  });

  if (!currentVote) {
    await CommentVote.create({
      userId: dto.userId,
      commentId: dto.commentId,
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
