const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {AUTH_SECRET} = require('./constants');

const userSchema = new mongoose.Schema(
    {
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
            unique: true,
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
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
);

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to log in');
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
        throw new Error('Unable to log in');
    }

    return user;
};

// hash before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign(
        {_id: user._id.toString()},
        AUTH_SECRET
    );

    user.tokens = user.tokens.concat({token});
    user.save();

    return token
};

const User = mongoose.model('User', userSchema);

module.exports = User;