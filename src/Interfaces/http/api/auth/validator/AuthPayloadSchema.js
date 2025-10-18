const Joi = require('joi');

const AuthUserSchema = Joi.object({
  username: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'Username tidak boleh kosong',
      'string.empty': 'Username tidak boleh kosong',
    }),
  password: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'Password tidak boleh kosong',
      'string.empty': 'Password tidak boleh kosong',
    }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'refresh token kosong',
      'string.empty': 'refresh token kosong',
    }),
});

module.exports = { AuthUserSchema, refreshTokenSchema};
