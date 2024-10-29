import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class CommentVote extends Model {
  declare id: number;
  declare choice: "up" | "down";
  declare userId: number;
}

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
  {
    sequelize,
    modelName: "commentVote",
    tableName: "CommentVotes",
  }
);