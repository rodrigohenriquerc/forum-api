import { body, param } from "express-validator";
import { runValidations } from "../../utils/validation.util";

export const commentsRequestValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
]);

export const commentCreationValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  body("content").trim().notEmpty().withMessage("Content is required."),
]);

export const commentDeletionValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  param("commentId").notEmpty().withMessage("Comment id is required."),
]);

export const commentUpdateValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  param("commentId").notEmpty().withMessage("Comment id is required."),
  body("content").trim().notEmpty().withMessage("Content is required."),
]);

export const commentUpvoteValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  param("commentId").notEmpty().withMessage("Comment id is required."),
]);

export const commentDownvoteValidator = runValidations([
  param("postId").notEmpty().withMessage("Post id is required."),
  param("commentId").notEmpty().withMessage("Comment id is required."),
]);
