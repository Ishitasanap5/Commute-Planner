import { body, validationResult } from "express-validator";

export const validateRoute = [
  body("start").notEmpty().withMessage("Start location required"),
  body("end").notEmpty().withMessage("End location required"),
  body("mode")
    .isIn(["bus", "train", "cab", "walk"])
    .withMessage("Invalid transport mode"),
  body("distance")
    .isFloat({ min: 0 })
    .withMessage("Distance must be positive number"),
  body("time")
    .isFloat({ min: 0 })
    .withMessage("Time must be positive number"),
  body("cost")
    .isFloat({ min: 0 })
    .withMessage("Cost must be positive number"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];