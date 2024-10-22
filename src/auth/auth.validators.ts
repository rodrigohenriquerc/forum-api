import { body } from "express-validator";
import { runValidations } from "../utils";

export const validateRegister = runValidations([
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),
]);

export const validateLogin = runValidations([
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
  body("password").notEmpty().withMessage("Password is required"),
]);
