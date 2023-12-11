const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        userObjectId: {
            type: String,
            required: true,
        },
        month: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: false,
        },
        expense: {
            type: Number,
            required: false,
        }
    },{collection: 'Expense'});

    module.exports = mongoose.model('Expense', expenseSchema);