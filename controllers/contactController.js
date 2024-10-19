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

const getAllContactsOld = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get all contacts
// In controllers/contactController.js
// Get all contacts with Pagination and sort using surname in ascending order
const getAllContactsOld2 = async (req, res) => {
    const { page = 1, limit = 10, sort = 'surname', order = 'asc'  } = req.query;
    try {
        // filter out contacts with deleted index of false
        const contacts = await Contact.find({ deleted: false })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .exec();
        
        const count = await Contact.countDocuments();
        res.status(200).json({
            contacts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all contacts with pagination, sorting, and ordering
const getAllContacts = async (req, res) => {
    const { page = 1, limit = 10, sort = 'surname', order = 'asc' } = req.query;
    
    // Ensure page and limit are integers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    try {
        // Get the total number of contacts
        const totalContacts = await Contact.countDocuments();
        
        // Calculate total pages based on limit
        const totalPages = Math.ceil(totalContacts / limitNum);
        
        // Fetch contacts with pagination, sorting, and ordering
        const contacts = await Contact.find({ deleted: false })
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);  // Calculate offset based on the page number
        
        res.status(200).json({
            contacts,
            totalPages,
            currentPage: pageNum
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get a single contact by ID
const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        
        // Check if contact exists
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Check if the contact's delete status is true
        if (contact.deleted === true) {
            return res.status(400).json({ message: 'This contact has been deleted' });
        }

        // Return the contact data if it's not deleted
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
const deleteContact1 = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
       const contact = await Contact.findByIdAndUpdate(id, { deleted: true });
       if(!contact)  return res.status(404).json({message: 'Contact Not found'});
        res.status(200).json({ message: 'Contact deleted successfully! (soft delete)' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Search contact by email or phone
const searchContact = async (req, res) => {
    const { email, phone } = req.query; // Get 'email' and 'phone' from the query parameters

    if (!email && !phone) {
        return res.status(400).json({ message: 'Email or phone query parameter is required' });
    }

    try {
        // Build search query object
        let searchCriteria = {};
        if (email) {
            searchCriteria.email = { $regex: new RegExp(email, 'i') }; // Case-insensitive email search
        }
        if (phone) {
            searchCriteria.phone = phone; // Exact match for phone
        }

        const contact = await Contact.findOne(searchCriteria);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        // Check if the contact's delete status is true
        if (contact.deleted === true) {
            return res.status(400).json({ message: 'This contact has been deleted' });
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error searching contact:', error);
        res.status(500).json({ message: 'Server error', error });
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
