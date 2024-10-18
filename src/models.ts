import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db";

export class User extends Model {
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
  }
);

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to sync the database:", error);
  }
})();
