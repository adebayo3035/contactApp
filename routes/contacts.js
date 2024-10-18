// routes/contacts.js
const express = require('express');
const router = express.Router();
const {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    searchContact
} = require('../controllers/contactController');
const { contactValidationRules, validate } = require('../middleware/contactValidator');
const authenticateToken = require('../middleware/authenticateToken');

// CRUD routes (Protected)
router.post('/', authenticateToken, contactValidationRules(), validate, createContact);
router.get('/', authenticateToken, getAllContacts);
router.get('/:id', authenticateToken, getContactById);
router.put('/:id', authenticateToken, contactValidationRules(), validate, updateContact);
router.delete('/:id', authenticateToken, deleteContact);

// Search route (Protected)
router.get('/search', authenticateToken, searchContact);

module.exports = router;
