import jwt from "jsonwebtoken";

export const generateToken = (obj: object) =>
  jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string) => {
  let access_token;

  if (token.startsWith("Bearer ")) {
    access_token = token.slice(7, token.length).trim();
  } else {
    access_token = token;
  }

  try {
    const result = jwt.verify(access_token, process.env.JWT_SECRET);
    return result;
  } catch {
    return null;
  }
};
