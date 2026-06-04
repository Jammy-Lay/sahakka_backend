const Joi = require("joi");

exports.createDocumentSchema = Joi.object({
  title: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Document title is required",
    "string.min": "Document title must be at least 3 characters",
    "string.max": "Document title cannot exceed 25 characters",
    "any.required": "Document title is required",
  }),
});

exports.updateDocumentTitleSchema = Joi.object({
  title: Joi.string().min(3).max(25).required().messages({
    "string.empty": "Document title is required",
    "string.min": "Document title must be at least 3 characters",
    "string.max": "Document title cannot exceed 25 characters",
    "any.required": "Document title is required",
  }),
});

