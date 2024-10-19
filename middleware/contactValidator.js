const { body, query, validationResult } = require('express-validator');

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

// Validation rules for search endpoint
const searchValidationRules = () => {
    return [
        // Check if at least one of email or phone is provided
        query('email').optional().isEmail().withMessage('Invalid email format'),
        query('phone').optional().matches(/^\d{11}$/).withMessage('Phone number must be 11 digits'),

        // Ensure that at least one of email or phone is present
        query().custom((_, { req }) => {
            if (!req.query.email && !req.query.phone) {
                throw new Error('At least one of email or phone must be provided');
            }
            return true;
        }),
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
    searchValidationRules,
    validate
};
