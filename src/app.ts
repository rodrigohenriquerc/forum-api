import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "./models";

import { User } from "./models";

const app = express();

app.use(express.json());

const port = 3000;

const JWT_SECRET = "your_jwt_secret_key";

const authMiddleware = (
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
      jwt.verify(access_token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};

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

      await User.create({
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
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res
          .status(200)
          .json({ messages: ["The user was authenticated"], token });
      }
    }
  }
});

app.get("/posts", authMiddleware, (req, res) => {
  res.status(200).json([]);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
