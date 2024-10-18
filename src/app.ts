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

      res.sendStatus(204);
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email) {
    errors.push("Email is required.");
  }
  if (!password) {
    errors.push("Password is required.");
  }

  if (errors.length) {
    res.status(400).json({ messages: errors });
  } else {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ messages: ["Invalid credentials."] });
    } else {
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        res.status(400).json({ messages: ["Invalid credentials."] });
      } else {
        res.status(200).json({ messages: ["The user was authenticated"] });
      }
    }
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
