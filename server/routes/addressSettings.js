const express = require('express');
const router = express.Router();
const AddressSettings = require('../models/AddressSettings');

// GET address settings
router.get('/', async (req, res) => {
    try {
        const settings = await AddressSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Address settings not found' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// POST (update) address settings
router.post('/', async (req, res) => {
    const { address, phoneNumbers, emails, description } = req.body;

    try {
        let settings = await AddressSettings.findOne();
        if (settings) {
            // Update existing settings
            settings.address = address;
            settings.phoneNumbers = phoneNumbers;
            settings.emails = emails;
            settings.description = description;
        } else {
            // Create new settings
            settings = new AddressSettings({
                address,
                phoneNumbers,
                emails,
                description,
            });
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;