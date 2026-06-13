const Joi = require("joi");

exports.registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),
  password: Joi.string()
    .trim()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])[A-Za-z0-9!@#\\$%\\^&\\* ]+$",
      ),
    )
    .required()
    .messages({
      "string.min":
        "Password must be at least 8 characters (spaces not counted at start/end)",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character, and can include spaces in the middle only",
      "string.empty": "Password is required",
    }),
});

exports.loginUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|sahakka\.com)$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),
  password: Joi.required(),
});

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),
});

exports.verifyOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
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
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),

  new_password: Joi.string()
    .trim()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])[A-Za-z0-9!@#\\$%\\^&\\* ]+$",
      ),
    )
    .required()
    .messages({
      "string.min":
        "Password must be at least 8 characters (spaces not counted at start/end)",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character, and can include spaces in the middle only",
      "string.empty": "Password is required",
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
    .trim()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])[A-Za-z0-9!@#\\$%\\^&\\* ]+$",
      ),
    )
    .required()
    .messages({
      "string.min":
        "Password must be at least 8 characters (spaces not counted at start/end)",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character, and can include spaces in the middle only",
      "string.empty": "Password is required",
    }),

  newPassword: Joi.string()
    .trim()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])[A-Za-z0-9!@#\\$%\\^&\\* ]+$",
      ),
    )
    .required()
    .messages({
      "string.min":
        "Password must be at least 8 characters (spaces not counted at start/end)",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, special character, and can include spaces in the middle only",
      "string.empty": "Password is required",
    }),

  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password does not match",
    "any.required": "Confirm password is required",
  }),
});

exports.resendEmailSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),
});

exports.changeNameSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
});

exports.inviteByEmailSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .required()
    .messages({
      "string.pattern.base": "Email must be a valid Gmail address (@gmail.com)",
      "string.empty": "Email is required",
    }),
});

exports.joinByTokenSchema = Joi.object({
  token: Joi.string()
    .trim()
    .length(8)
    .pattern(/^[a-zA-Z0-9]+$/)
    .required()
    .messages({
      "string.empty": "Token is required",
      "string.length": "Token must be exactly 8 characters",
      "string.pattern.base": "Token must contain only letters and numbers",
      "any.required": "Token is required",
    }),
});
