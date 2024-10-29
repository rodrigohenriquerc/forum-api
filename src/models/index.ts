import { User } from "./user.model";
import { Post } from "./post.model";
import { Comment } from "./comment.model";
import { PostVote } from "./post-vote.model";
import { CommentVote } from "./comment-vote.model";

import { sequelize } from "../db";

User.hasMany(Post);
User.hasMany(Comment);
User.hasMany(PostVote);
User.hasMany(CommentVote);

Post.belongsTo(User);
Post.hasMany(Comment);
Post.hasMany(PostVote);
Post.hasMany(CommentVote);

Comment.belongsTo(User);
Comment.belongsTo(Post);
Comment.hasMany(CommentVote);

PostVote.belongsTo(User);
PostVote.belongsTo(Post);

CommentVote.belongsTo(User);
CommentVote.belongsTo(Post);
CommentVote.belongsTo(Comment);

export const syncModels = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
};
