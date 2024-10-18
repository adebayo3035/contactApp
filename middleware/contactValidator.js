const { body, validationResult } = require('express-validator');

// Validation rules for contact data
const contactValidationRules = () => {
    return [
        // Surname validation: must not be empty, must be a string
        body('firstname')
            .notEmpty().withMessage('Surname is required')
            .isString().withMessage('Surname must be a string'),

        // Firstname validation: must not be empty, must be a string
        body('surname')
            .notEmpty().withMessage('Firstname is required')
            .isString().withMessage('Firstname must be a string'),

        // Email validation: must be a valid email format
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email address'),

        // Phone validation: must be a valid 11-digit number (adjust as needed)
        body('phone')
            .notEmpty().withMessage('Phone number is required')
            .isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits')
            .isNumeric().withMessage('Phone number must contain only numbers'),


        // Address validation: optional, but must be a string if provided
        body('address')
            .optional()  // Address is optional
            .isString().withMessage('Address must be a string'),
    ];
};

// Middleware to validate the request
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    contactValidationRules,
    validate
};
