const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.status(500).send(e)

    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send()
    }
});

router.patch('/users/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const validMatches = updates.every((update) => allowedUpdates.includes(update));
        if (!validMatches) {
            res.status(400).send('error: Invalid update!.')
        }

        const user = await User.findByIdAndUpdate(
            _id,
            req.body,
            {new: true, runValidators: true}
        );
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(400).send()
    }
});

router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send(newUser)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send();
        }

        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;