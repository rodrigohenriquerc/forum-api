import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
    tableName: "Users",
  }
);
