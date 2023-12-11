const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        defaultValue: {
            type: Number,
            required: false,
        },
    },{collection: 'Category'});

    module.exports = mongoose.model('Category', categorySchema);