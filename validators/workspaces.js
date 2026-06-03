const Joi = require("joi");

exports.createWorkspaceSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Workspace name is required",
            "string.min": "Workspace name must be at least 3 characters",
            "string.max": "Workspace name cannot exceed 100 characters",
            "any.required": "Workspace name is required",
        }),
});

exports.workspaceIdSchema = Joi.object({
    workspace_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Workspace ID must be a number",
            "number.integer": "Workspace ID must be an integer",
            "number.positive": "Workspace ID must be positive",
            "any.required": "Workspace ID is required",
        }),
});

exports.updateWorkspaceSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Workspace name is required",
            "string.min": "Workspace name must be at least 3 characters",
            "string.max": "Workspace name cannot exceed 100 characters",
            "any.required": "Workspace name is required",
        }),
});