const Joi = require('joi');

const commentPayloadSchema = Joi.object({
  content: Joi.string()
    .required()
    .trim()
    .messages({
      'any.required': 'content tidak boleh kosong',
      'string.empty': 'content tidak boleh berisi string kosong',
      'string.base': 'content harus berupa string',
    }),
});

module.exports = commentPayloadSchema;
