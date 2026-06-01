const Joi = require("joi");

exports.createWorkspaceSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
});

exports.updateWorkspaceSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
});

exports.workspaceIdSchema = Joi.object({
    workspace_id: Joi.number()
    .integer()
    .positive()
    .required()
});