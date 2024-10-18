import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  database: "forum",
  username: "rodrigo",
  password: "1234",
  host: "localhost",
  dialect: "postgres",
  logging: console.log,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
