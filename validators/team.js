const Joi = require("joi");
exports.createTeamSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Team title is required",
            "string.min": "Team title must be at least 3 characters",
            "string.max": "Team title cannot exceed 100 characters",
            "any.required": "Team title is required",
        }),

    description: Joi.string()
        .max(255)
        .allow("")
        .optional()
        .messages({
            "string.max": "Description cannot exceed 255 characters",
        })
});

exports.teamIdSchema = Joi.object({
    team_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Team ID must be a number",
            "number.integer": "Team ID must be an integer",
            "number.positive": "Team ID must be positive",
            "any.required": "Team ID is required",
        }),
});

exports.updateTeamSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      "string.min": "Team title must be at least 3 characters",
      "string.max": "Team title cannot exceed 100 characters",
    }),

  description: Joi.string()
    .max(255)
    .allow("")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 255 characters",
    }),
});