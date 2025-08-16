import Joi from "joi";
import { validationErrorResponse } from "../utils/responseHandler.js";

// Generic validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return validationErrorResponse(res, errors);
    }

    next();
  };
};

// Project validation schema
export const projectValidationSchema = Joi.object({
  title: Joi.string().required().trim().max(100).messages({
    "string.empty": "Title is required",
    "string.max": "Title cannot be more than 100 characters",
  }),
  description: Joi.string().trim().max(500).optional().messages({
    "string.max": "Description cannot be more than 500 characters",
  }),
  status: Joi.string()
    .valid("planning", "active", "completed", "on-hold")
    .default("planning"),
  progress: Joi.number().min(0).max(100).default(0),
  team: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        avatar: Joi.string().trim().optional(),
      })
    )
    .optional(),
  dueDate: Joi.date().greater("now").optional(),
});

// Task validation schema
export const taskValidationSchema = Joi.object({
  title: Joi.string().required().trim().max(100).messages({
    "string.empty": "Task title is required",
    "string.max": "Title cannot be more than 100 characters",
  }),
  description: Joi.string().trim().max(500).optional().messages({
    "string.max": "Description cannot be more than 500 characters",
  }),
  status: Joi.string().valid("todo", "in-progress", "done").default("todo"),
  priority: Joi.string().valid("low", "medium", "high").default("medium"),
  assignee: Joi.object({
    name: Joi.string().required().trim(),
    avatar: Joi.string().trim().optional(),
  }).required(),
  projectId: Joi.string().required().messages({
    "string.empty": "Project ID is required",
  }),
  dueDate: Joi.date().greater("now").optional(),
  estimatedHours: Joi.number().min(0).optional(),
  actualHours: Joi.number().min(0).default(0),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});

// Update validation schemas (partial updates)
export const projectUpdateValidationSchema = Joi.object({
  title: Joi.string().trim().max(100).optional(),
  description: Joi.string().trim().max(500).optional(),
  status: Joi.string()
    .valid("planning", "active", "completed", "on-hold")
    .optional(),
  progress: Joi.number().min(0).max(100).optional(),
  team: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        avatar: Joi.string().trim().optional(),
      })
    )
    .optional(),
  dueDate: Joi.date().greater("now").optional(),
});

export const taskUpdateValidationSchema = Joi.object({
  title: Joi.string().trim().max(100).optional(),
  description: Joi.string().trim().max(500).optional(),
  status: Joi.string().valid("todo", "in-progress", "done").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  assignee: Joi.object({
    name: Joi.string().trim(),
    avatar: Joi.string().trim().optional(),
  }).optional(),
  dueDate: Joi.date().greater("now").optional(),
  estimatedHours: Joi.number().min(0).optional(),
  actualHours: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
});
