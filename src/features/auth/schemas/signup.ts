import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Username must be a string.',
    'string.min': 'Username must be at least 4 characters long.',
    'string.max': 'Username cannot be longer than 12 characters.',
    'string.empty': 'Username is required'
  }),
  password: Joi.string().required().min(8).max(20).messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 4 characters long.',
    'string.max': 'Password cannot be longer than 16 characters.',
    'string.empty': 'Password is required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.required': 'Confirm password is required',
    'any.only': 'Passwords do not match'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be valid.',
    'string.empty': 'Email is required'
  }),
  avatarImage: Joi.string().optional().messages({
    'string.base': 'Avatar image must be a string.'
  })
});

export { signupSchema };
