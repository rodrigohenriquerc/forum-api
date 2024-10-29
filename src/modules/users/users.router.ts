import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { JwtPayload } from "jsonwebtoken";
import { meUpdateValidator } from "./users.validators";
import { findUserById, updateUser } from "../../repositories/user.repository";

export const usersRouter = Router();

usersRouter.get("/users/me", authMiddleware, async (req, res) => {
  const userId = (req.user as JwtPayload)?.id;

  const user = await findUserById(userId);

  res.json({ data: user });
});

usersRouter.put(
  "/users/me/update",
  authMiddleware,
  meUpdateValidator,
  async (req, res) => {
    const userId = (req.user as JwtPayload)?.id;

    const { name, email } = req.body;

    await updateUser({ id: userId, name, email });

    res.json({ messages: ["Your data was updated."] });
  }
);
