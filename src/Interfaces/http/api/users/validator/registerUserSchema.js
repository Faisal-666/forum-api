const Joi = require('joi');

const registerUserSchema = Joi.object({
  username: Joi.string()
    .max(50)
    .pattern(/^[\w]+$/)
    .required()
    .messages({
      'string.base': 'tidak dapat membuat user baru karena tipe data tidak sesuai',
      'string.max': 'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      'string.pattern.base': 'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      'any.required': 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
    }),
  fullname: Joi.string().required().messages({
    'string.base': 'tidak dapat membuat user baru karena tipe data tidak sesuai',
    'any.required': 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  }),
  password: Joi.string().required().messages({
    'string.base': 'tidak dapat membuat user baru karena tipe data tidak sesuai',
    'any.required': 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  }),
});

module.exports = registerUserSchema;