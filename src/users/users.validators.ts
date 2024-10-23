import { body } from "express-validator";
import { runValidations } from "../utils";

export const meUpdateValidator = runValidations([
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Email is not valid."),
]);
