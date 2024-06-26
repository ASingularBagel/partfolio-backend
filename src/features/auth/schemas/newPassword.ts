import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be valid.',
    'string.empty': 'Email is required.'
  })
});

const newPasswordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'Password should be a string',
    'string.min': 'Invalid password.',
    'string.max': 'Invalid password.',
    'string.empty': 'Password is required.'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm password is a required field'
  })
});

export { emailSchema, newPasswordSchema };
