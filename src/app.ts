import express from "express";
import "./models";

import { authRouter } from "./auth/auth.router";

const app = express();

app.use(express.json());

const port = 3000;

app.use(authRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
