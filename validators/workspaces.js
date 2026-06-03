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