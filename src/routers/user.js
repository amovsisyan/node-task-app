const express = require('express');
const User = require('../models/user');
const authenticated = require('./middlewares/authenticated');
const router = new express.Router();

router.post('/login', async (req, res) => {
   try {
       const {email, password} = req.body;

       const user = await User.findByCredentials(email, password);
       const token = await user.generateAuthToken();
       res.send({user, token});
   } catch (e) {
       res.status(400).send(e)
   }
});

router.post('/logout', authenticated, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send({user: req.user });
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.status(201).send({user: newUser, token})
    } catch (e) {
        res.status(400).send(e)
    }
});

router.get('/users/me', authenticated, async (req, res) => {
    res.send(req.user);
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

        const user = await User.findById(_id);

        if (!user) {
            return res.status(404).send();
        }

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (e) {
        res.status(400).send()
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