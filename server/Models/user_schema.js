const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        lastLogin: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: false,
        },
    },{collection: 'User'});

    module.exports = mongoose.model('User', userSchema);