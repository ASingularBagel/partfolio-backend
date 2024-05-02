import Joi, { ObjectSchema } from 'joi';

const loginUsernameSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(12).messages({
    'string.base': 'Username must be a string.',
    'string.min': 'Username must be at least 4 characters long.',
    'string.max': 'Username cannot be longer than 12 characters.',
    'string.empty': 'Username is required.'
  }),
  password: Joi.string().required().min(4).max(16).messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Invalid password.',
    'string.max': 'Invalid password.',
    'string.empty': 'Password is required.'
  })
});

export { loginUsernameSchema };
