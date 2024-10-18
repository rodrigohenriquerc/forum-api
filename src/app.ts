import express from "express";
import bcrypt from "bcrypt";
import "./models";

import { User } from "./models";

const app = express();

app.use(express.json());

const port = 3000;

app.get("/", (_req, res) => {
  res.json({ message: "Hi!" });
});

app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (!name) {
    errors.push("Name is required.");
  }
  if (!email) {
    errors.push("Email is required.");
  }
  if (!password) {
    errors.push("Password is required.");
  }

  if (errors.length) {
    res.status(400).json({ messages: errors });
  } else {
    bcrypt.hash(password, 10, async (error, passwordHash) => {
      if (error) throw Error("Unable to hash the password");

      const user = await User.create({
        name,
        email,
        password_hash: passwordHash,
      });

      console.log(user.toJSON());

      res.sendStatus(204);
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
