import { Request, Response, NextFunction } from "express";

import { body, ContextRunner } from "express-validator";

const validateName = () => {
  return body("name").trim().notEmpty().withMessage("Name is required.");
};

const validateEmail = () => {
  return body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid.");
};

const validatePassword = () => {
  return body("password").notEmpty().withMessage("Password is required");
};

const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array().map(({ msg }) => msg) });
        return;
      }
    }

    next();
  };
};

export const validateRegister = validate([
  validateName(),
  validateEmail(),
  validatePassword()
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
]);

export const validateLogin = validate([validateEmail(), validatePassword()]);
