import { validationResult, body } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validationRules = [
  body().isArray().withMessage("Request body must be an array"),
  body("*.event")
    .notEmpty()
    .withMessage("The event field is required")
    .isString()
    .withMessage("The event field must be a string"),
  body("*.tags")
    .notEmpty()
    .withMessage("The tags field is required")
    .isArray()
    .withMessage("The tags field must be an array"),
  body("*.url")
    .notEmpty()
    .withMessage("The URL field is required")
    .isString()
    .withMessage("The URL field must be a valid URL"),
  body("*.title")
    .notEmpty()
    .withMessage("The title field is required")
    .isString()
    .withMessage("The title field must be a string"),
  body("*.ts")
    .notEmpty()
    .withMessage("The timestamp field is required")
    .isNumeric()
    .withMessage("The timestamp field must be a number"),
];

const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers["content-type"] !== "application/json") {
    return res
      .status(422)
      .json({ message: "Content type must be application/json" });
  }
  next();
};

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    const messages = err.array().reduce((acc, err: any) => {
      const field = err.path.replace(/\[\d+\]\./, "");
      acc[field] = err.msg;
      return acc;
    }, {} as Record<string, string>);
    return res
      .status(422)
      .json({ errors: messages, message: "Validation failed" });
  }
  next();
};

export const validationMiddleware = [
  ...validationRules,
  validateContentType,
  handleValidationErrors,
];
