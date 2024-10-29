import { body, param } from "express-validator";
import { runValidations } from "../../utils/validation.util";

export const postCreationValidator = runValidations([
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("content").trim().notEmpty().withMessage("Content is required."),
]);

export const postDeletionValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
]);

export const postUpdateValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("content").trim().notEmpty().withMessage("Content is required."),
]);

export const postUpvoteValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
]);

export const postDownvoteValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
]);
