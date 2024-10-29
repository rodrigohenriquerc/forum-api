import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

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
    modelName: "comment",
    tableName: "Comments"
  }
);
