import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import { meUpdateValidator } from "./users.validators";
import { User } from "../../models/user.model";

export const usersRouter = Router();

usersRouter.get("/users/me", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const user = await User.findOne({ where: { id: userId } });

  res.json({ data: user });
});

usersRouter.put(
  "/users/me/update",
  authMiddleware,
  meUpdateValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { name, email } = req.body;

    await User.update({ name, email }, { where: { id: userId } });

    res.json({ messages: ["Your data was updated."] });
  }
);
