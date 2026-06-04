const Joi = require("joi");

exports.submitTaskSchema = Joi.object({
  message: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Message cannot exceed 1000 characters",
  }),
});

exports.updateSubmissionStatusSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required().messages({
    "any.only": "Status must be approved or rejected",
    "any.required": "Status is required",
  }),

  feedback: Joi.string().min(3).max(1000).required().messages({
    "string.empty": "Feedback is required",
    "string.min": "Feedback must be at least 3 characters",
    "string.max": "Feedback cannot exceed 1000 characters",
    "any.required": "Feedback is required",
  }),
});
