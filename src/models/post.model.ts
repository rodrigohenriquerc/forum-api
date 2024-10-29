import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Post extends Model {
  declare id: number;
  declare title: string;
  declare content: string;
  declare createdAt: string;
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
  {
    sequelize,
    modelName: "post",
    tableName: "Posts",
  }
);
