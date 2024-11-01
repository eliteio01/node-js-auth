const Joi = require('joi');

// Define and export the validation schema
const userValidationSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format'
    }),
    password: Joi.string().min(8)
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain uppercase, lowercase, and a number'
        })
});

module.exports = userValidationSchema;
