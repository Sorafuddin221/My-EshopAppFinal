const mongoose = require('mongoose');

const addressSettingsSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    phoneNumbers: {
        type: [String],
        required: true,
    },
    emails: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.models.AddressSettings || mongoose.model('AddressSettings', addressSettingsSchema);