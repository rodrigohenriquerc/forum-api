import express from "express";
import "./models";

import { authRouter } from "./auth/auth.router";
import { postsRouter } from "./posts/posts.router";

const app = express();

app.use(express.json());

const port = process.env.API_PORT;

app.use(authRouter, postsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
