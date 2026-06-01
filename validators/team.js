const Joi = require("joi");

exports.createTeamSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required(),

    description: Joi.string()
        .max(500)
        .allow("")
});

exports.updateTeamSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100),

    description: Joi.string()
        .max(500)
});

exports.teamIdSchema = Joi.object({
    team_id: Joi.number()
    .integer()
    .positive()
    .required()
});