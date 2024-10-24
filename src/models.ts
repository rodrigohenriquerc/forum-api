import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password_hash: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    name: { singular: "user" },
  }
);

export class Post extends Model {
  declare id: number;
  declare title: string;
  declare content: string;
  declare createdAt: string;
  declare user: User;
  declare comments: Comment[];
  declare votes: PostVote[];
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export class Comment extends Model {
  declare id: number;
  declare content: string;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    name: {
      plural: "comments",
    },
  }
);

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

export class Vote extends Model {
  declare id: number;
  declare choice: "up" | "down";
  declare userId: number;
}

export class PostVote extends Vote {}

PostVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    choice: {
      type: DataTypes.ENUM("up", "down"),
      allowNull: false,
    },
  },
  { sequelize, name: { plural: "votes" } }
);

Post.hasMany(PostVote, { foreignKey: "postId" });
PostVote.belongsTo(Post, { foreignKey: "postId" });
User.hasMany(PostVote, { foreignKey: "userId" });
PostVote.belongsTo(User, { foreignKey: "userId" });

export class CommentVote extends Vote {}

CommentVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    choice: {
      type: DataTypes.ENUM("up", "down"),
      allowNull: false,
    },
  },
  { sequelize }
);

Post.hasMany(CommentVote, { foreignKey: "postId" });
CommentVote.belongsTo(Post, { foreignKey: "postId" });
Comment.hasMany(CommentVote, { foreignKey: "commentId" });
CommentVote.belongsTo(Comment, { foreignKey: "commentId" });
User.hasMany(CommentVote, { foreignKey: "userId" });
CommentVote.belongsTo(User, { foreignKey: "userId" });

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
})();
