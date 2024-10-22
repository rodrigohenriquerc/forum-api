import { Router } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models";

export const authRouter = Router();

authRouter.post("/auth/register", (req, res) => {
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

      await User.create({
        name,
        email,
        password_hash: passwordHash,
      });

      res.sendStatus(204);
    });
  }
});

authRouter.post("/auth/login", async (req, res) => {
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
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        res
          .status(200)
          .json({ messages: ["The user was authenticated"], token });
      }
    }
  }
});
