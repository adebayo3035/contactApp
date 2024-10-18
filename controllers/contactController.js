const Contact = require('../models/Contact');

// Controller for creating a new contact
const createContact = async (req, res) => {
    const { firstname, surname, email, phone, address } = req.body;

    try {
        // Check if email or phone already exists in the database
        const existingContact = await Contact.findOne({ 
            $or: [{ email: email }, { phone: phone }] 
        });
        
        if (existingContact) {
            return res.status(400).json({ message: 'Email or Phone number already exists' });
        }

        // Create new contact
        const newContact = new Contact({
            firstname,
            surname,
            email,
            phone,
            address
        });

        // Save the new contact
        await newContact.save();
        res.status(201).json({ message: 'Contact created successfully', contact: newContact });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get all contacts
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a single contact by ID
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a contact by ID
const updateContact = async (req, res) => {
    const { firstname, surname, email, phone, address } = req.body;
    const contactId = req.params.id;

    try {
        // Check if email or phone already exists in another contact (excluding the current one)
        const existingContact = await Contact.findOne({
            _id: { $ne: contactId }, // Exclude the current contact from the search
            $or: [{ email: email }, { phone: phone }]
        });

        if (existingContact) {
            return res.status(400).json({ message: 'Email or Phone number already exists' });
        }

        // Update the contact
        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            { surname, firstname, phone, email, address },
            { new: true } // Return the updated contact
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully', contact: updatedContact });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Delete a contact by ID
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Search contact by email or phone
const searchContact = async (req, res) => {
    try {
        const { query } = req.query;
        const contact = await Contact.findOne({
            $or: [{ email: query }, { phone: query }],
        });
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    searchContact,
};
