const express = require('express');
const User = require('../models/user');
const authenticated = require('./middlewares/authenticated');
const avatarUpload = require('./middlewares/avatar');
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

router.patch('/users/me', authenticated, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const validMatches = updates.every((update) => allowedUpdates.includes(update));
        if (!validMatches) {
            res.status(400).send('error: Invalid update!.')
        }

        const user = req.user;
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (e) {
        res.status(400).send()
    }
});

router.delete('/users/me', authenticated, async (req, res) => {
    try {
        await req.user.remove();
        res.status(201).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/users/me/avatar', authenticated, avatarUpload.single('avatar'), async (req, res) => {
    try {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.status(201).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', authenticated, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.get('/users/me/avatar', authenticated, async (req, res) => {
    try {
        res.set('Content-Type', 'image/jpg');
        res.status(200).send(req.user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;