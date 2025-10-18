const Joi = require('joi');

const threadPostSchema = Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'title tidak boleh kosong',
      'string.empty': 'title tidak boleh berisi string kosong',
      'string.base': 'title harus berupa string',
    }),
  body: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'Body tidak boleh kosong',
      'string.empty': 'Body tidak boleh berisi string kosong',
      'string.base': 'Body harus berupa string',
    }),
});

module.exports = threadPostSchema;
