const Joi = require("joi");

exports.createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(40).required().messages({
    "string.empty": "Task title is required",
    "string.min": "Task title must be at least 3 characters",
    "string.max": "Task title cannot exceed 40 characters",
    "any.required": "Task title is required",
  }),

  description: Joi.string().allow("").optional(),

  type: Joi.string()
    .valid("bug", "feature", "task", "improvement")
    .optional()
    .messages({
      "any.only": "Invalid task type",
    }),

  status: Joi.string()
    .valid("todo", "in_progress", "submitted", "approved", "rejected")
    .optional()
    .messages({
      "any.only": "Invalid task status",
    }),

  priority: Joi.string()
    .valid("urgent", "high", "medium", "low")
    .optional()
    .messages({
      "any.only": "Invalid task priority",
    }),

  assigned_to: Joi.number().integer().positive().optional(),

  start_date: Joi.date().optional(),

  end_date: Joi.date().optional(),
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),

  description: Joi.string().allow("").optional(),

  type: Joi.string().valid("bug", "feature", "task", "improvement").optional(),

  status: Joi.string()
    .valid("todo", "in_progress", "submitted", "approved", "rejected")
    .optional(),

  priority: Joi.string().valid("urgent", "high", "medium", "low").optional(),

  assigned_to: Joi.number().integer().positive().optional().allow(null),

  start_date: Joi.date().optional().allow(null),

  end_date: Joi.date().optional().allow(null),
});
