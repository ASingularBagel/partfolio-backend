import Joi, { ObjectSchema } from 'joi';

const loginEmailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid.',
    'string.empty': 'Email is required.'
  }),
  password: Joi.string().required().min(4).max(16).messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Invalid password.',
    'string.max': 'Invalid password.',
    'string.empty': 'Password is required.'
  })
});

export { loginEmailSchema };
