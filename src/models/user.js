const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email')
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate: {
            validator: function (value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Invalid password')
                }
            }
        }
    },
    age: {
        type: Number,
        default: 1,
        validate: {
            validator: function (value) {
                if (value <= 0) {
                    throw new Error('Age must be greater than 0');
                }
            }
        }
    }
});

module.exports = User;