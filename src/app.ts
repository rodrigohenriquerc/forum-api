import express from "express";
import "./models";

import { authRouter } from "./modules/auth/auth.router";
import { postsRouter } from "./modules/posts/posts.router";
import { commentsRouter } from "./modules/comments/comments.router";
import { usersRouter } from "./modules/users/users.router";

const app = express();

app.use(express.json());

const port = process.env.API_PORT;

app.use(authRouter, postsRouter, commentsRouter, usersRouter);

app.use((_, res) => {
  res.status(404).json({ messages: ["Not found"] });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
