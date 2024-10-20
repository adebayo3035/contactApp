// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const userRegistrationValidationRules = () => [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['User', 'Admin']).withMessage('Invalid role'),
];

// Validation rules for login
const userLoginValidationRules = () => [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Middleware to check validation result
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    userRegistrationValidationRules,
    userLoginValidationRules,
    validate,
};
