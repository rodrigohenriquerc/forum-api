import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "./models";

import { JWT_SECRET } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Promise<void> => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  } else {
    let access_token;

    if (token.startsWith("Bearer ")) {
      access_token = token.slice(7, token.length).trim();
    } else {
      access_token = token;
    }

    try {
      const decoded = jwt.verify(access_token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};
