import { Router, Request, Response } from "express";

import { matchedData } from "express-validator";

import { registerValidator, loginValidator } from "./auth.validators";
import { hashPassword, checkPassword } from "../../utils/password.util";
import { generateToken } from "../../utils/jwt.util";
import {
  createUser,
  findUserByEmail,
} from "../../repositories/user.repository";

export const authRouter = Router();

authRouter.post(
  "/auth/register",
  registerValidator,
  async (req: Request, res: Response) => {
    const { name, email, password } = matchedData(req);

    const user = await findUserByEmail(email);

    if (user) {
      res.status(400).json({ messages: ["Email already in use"] });
      return;
    }

    const passwordHash = hashPassword(password);

    if (!passwordHash) {
      res
        .status(400)
        .json({ messages: ["Error registering user. Try again."] });
      return;
    }

    await createUser({
      name,
      email,
      passwordHash,
    });

    res.status(200).json({ messages: ["The user has been registered."] });
  }
);

authRouter.post("/auth/login", loginValidator, async (req, res) => {
  const { email, password } = matchedData(req);

  const user = await findUserByEmail(email);

  if (!user) {
    res.status(400).json({ messages: ["Invalid email."] });
    return;
  }

  const isMatch = await checkPassword(password, user.passwordHash);

  if (!isMatch) {
    res.status(400).json({ messages: ["Invalid password."] });
    return;
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  res.status(200).json({ messages: ["The user was authenticated."], token });
});
