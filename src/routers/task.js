const express = require('express');
const Task = require('../models/task');
const authenticated = require('./middlewares/authenticated');
const router = new express.Router();

router.get('/tasks', authenticated, async (req, res) => {
    try {
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        
        console.log();
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/tasks/:id', authenticated, async (req, res) => {
    try {
        const {id: _id} = req.params;
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send('');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }
});

router.patch('/tasks/:id', authenticated, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed'];
        const validMatches = updates.every((update) => allowedUpdates.includes(update));
        if (!validMatches) {
            res.status(400).send('error: Invalid update!.')
        }

        const {id: _id} = req.params;
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send()
    }
});

router.post('/tasks', authenticated, async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            owner: req.user._id
        });
        await newTask.save();
        res.status(201).send(newTask)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const task = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }

        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;