const Joi = require("joi");

exports.registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().min(3).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})",
      ),
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
});

exports.loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

exports.verifyOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
});

exports.resetPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  new_password: Joi.string()
    .min(8)
    .max(30)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password cannot exceed 30 characters",
      "any.required": "New password is required",
    }),

  confirm_password: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required",
    }),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .max(50)
    .required()
    .messages({
      "string.empty": "Current password is required",
      "string.min": "Current password must be at least 8 characters",
      "any.required": "Current password is required",
    }),

  newPassword: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base":
        "New password must contain uppercase, lowercase and number",
      "any.required": "New password is required",
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password does not match",
      "any.required": "Confirm password is required",
    }),
});

exports.resendEmailSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

exports.changeNameSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Name is required",
    }),
});