import { Router, Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { matchedData } from "express-validator";

import { User } from "../models";
import { validateLogin, validateRegister } from "./auth.validators";

export const authRouter = Router();

authRouter.post(
  "/auth/register",
  validateRegister,
  async (req: Request, res: Response) => {
    const { name, email, password } = matchedData(req);

    const user = await User.findOne({ where: { email } });

    if (user) {
      res.status(400).json({ messages: ["Email already in use"] });
      return;
    }

    bcrypt.hash(password, 10, async (error, passwordHash) => {
      if (error) {
        res
          .status(400)
          .json({ messages: ["Error registering user. Try again."] });
        return;
      }

      const user = await User.create({
        name,
        email,
        password_hash: passwordHash,
      });

      res.status(200).json({ data: user });
    });
  }
);

authRouter.post("/auth/login", validateLogin, async (req, res) => {
  const { email, password } = matchedData(req);

  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(400).json({ messages: ["Invalid email."] });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    res.status(400).json({ messages: ["Invalid password."] });
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.status(200).json({ messages: ["The user was authenticated"], token });
});
