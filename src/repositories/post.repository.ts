import { Post } from "../models/post.model";
import { PostVote } from "../models/post-vote.model";
import { User } from "../models/user.model";
import { sequelize } from "../db";

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
    attributes: {
      exclude: ["updatedAt", "userId"],
      include: [
        [
          sequelize.literal(`
              CAST(
                COALESCE(
                  (
                    SELECT
                      COUNT(c.id)
                    FROM
                      "Comments" c
                    WHERE
                      c."postId" = post.id
                  ),
                  0
                ) AS INTEGER
              )
            `),
          "commentsCount",
        ],
        [
          sequelize.literal(`
              CAST(
                COALESCE(
                  (
                    SELECT
                      SUM(
                        CASE
                          WHEN pv.choice = 'up' THEN 1
                          WHEN pv.choice = 'down' THEN -1
                          ELSE 0
                        END
                      )
                    FROM
                      "PostVotes" pv
                    WHERE
                      pv."postId" = post.id
                  ),
                  0
                ) AS INTEGER
              )
            `),
          "votingBalance",
        ],
      ],
    },
    include: [{ model: User, attributes: ["id", "name"] }],
    group: ["post.id", "user.id"],
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
