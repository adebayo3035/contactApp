// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { userRegistrationValidationRules, userLoginValidationRules, validate } = require('../middleware/validation');

// User registration route
router.post('/register', userRegistrationValidationRules(), validate, register);

// User login route
router.post('/login', userLoginValidationRules(), validate, login);

module.exports = router;
