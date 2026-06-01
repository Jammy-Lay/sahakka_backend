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
    .email()
    .required()
});

exports.verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  otp: Joi.string()
    .length(6)
    .required()
});

exports.resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  new_password: Joi.string()
    .min(6)
    .required(),

  confirm_password: Joi.any()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Passwords do not match"
    })
});

exports.inviteByEmailSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

exports.joinByTokenSchema = Joi.object({
  token: Joi.string()
    .length(8)
    .required()
});

exports.changeNameSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
});