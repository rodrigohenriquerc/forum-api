import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Authorization denied: no token." });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res
      .status(401)
      .json({ message: "Authorization denied: token is not valid." });
    return;
  }

  req.user = decoded;
  next();
};
