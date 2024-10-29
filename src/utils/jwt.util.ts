import jwt from "jsonwebtoken";

export const generateToken = (obj: object) =>
  jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string) => {
  const accessToken = parseToken(token);

  try {
    const result = jwt.verify(accessToken, process.env.JWT_SECRET);
    return result;
  } catch {
    return null;
  }
};

export const refreshToken = (token: string) => {
  const accessToken = parseToken(token);
  const decoded = jwt.decode(accessToken, { complete: true });

  if (!decoded) {
    return;
  }

  const newToken = generateToken(decoded as object);

  return newToken;
};

export const parseToken = (token: string) => {
  if (token.startsWith("Bearer ")) {
    return token.slice(7, token.length).trim();
  }

  return token;
};
