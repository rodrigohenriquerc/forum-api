import { Request, Response, NextFunction } from "express";
import { ContextRunner } from "express-validator";

export const runValidations = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
      }
    }

    next();
  };
};
