import * as Joi from '@hapi/joi';

export const registerationSchema = Joi.object()
  .keys({
    fullName: Joi.string()
      .required()
      .label('Full Name')
      .messages({
        'any.required': 'Your full name is required',
        'string.empty': `Your full name cannot be empty!`,
        'string.pattern.base': `Your full name format is incorrect. - e.g. Jane Doe`,
      }),
    email: Joi.string()
      .email()
      .required()
      .label('Email Address')
      .messages({
        'any.required': 'Email Address is required',
        'string.empty': `Email Address cannot be empty!`,
        'string.pattern.base': `Email Address format is incorrect`,
      }),
    password: Joi.string()
      .required()
      .label('Password')
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#!@#$%^&*()@$!%*?&])[A-Za-z\d#!@#$%^&*()@$!%*?&]{6,}$/)
      .messages({
        'any.required': 'Password is required',
        'string.empty': `Password cannot be empty!`,
        'string.pattern.base': `Password should contain at least a character(lowercase and uppercase), number and special character`,
      }),
  })
  .required();

export const loginSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required()
      .label('Email Address')
      .messages({
        'any.required': 'Email Address is required',
        'string.empty': `Email Address cannot be empty!`,
        'string.pattern.base': `Email Address format is incorrect`,
      }),
    password: Joi.string()
      .required()
      .label('Password')
      .messages({
        'any.required': 'Password is required',
        'string.empty': `Password cannot be empty!`,
        'string.pattern.base': `Password should contain at least a character(lowercase and uppercase), number and special character`,
      }),
  })
  .required();
