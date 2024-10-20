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
const { contactValidationRules, searchValidationRules, validate } = require('../middleware/contactValidator');
const authenticateToken = require('../middleware/authenticateToken');
const { authorizeRoles } = require('../middleware/role');

// CRUD routes (Protected)
router.post('/', authenticateToken, contactValidationRules(), validate, createContact);
router.get('/', authenticateToken, getAllContacts);
// Search route (Protected)
router.get('/search', authenticateToken, searchValidationRules(), validate, searchContact);
router.get('/:id', authenticateToken, getContactById);
router.put('/:id', authenticateToken, authorizeRoles(['Admin']), contactValidationRules(), validate, updateContact);
//router.delete('/:id', authenticateToken, deleteContact);
router.delete('/:id', authenticateToken, authorizeRoles(['Admin']), deleteContact);




module.exports = router;
