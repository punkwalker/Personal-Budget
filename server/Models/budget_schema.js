const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        userObjectID: {
            type: String,
            required: true,
        },
        budget: {
            type: Array,
            required: false,
        }
    },{collection: 'Budget'});

    module.exports = mongoose.model('Budget', budgetSchema);