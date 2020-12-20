const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (e) {
        res.status(500).send()
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send()
    }
});

router.patch('/tasks/:id', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed'];
        const validMatches = updates.every((update) => allowedUpdates.includes(update));
        if (!validMatches) {
            res.status(400).send('error: Invalid update!.')
        }

        const {id: _id} = req.params;
        const task = await Task.findById(_id,);
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

router.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).send(newTask)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const {id: _id} = req.params;
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send();
        }

        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
});

module.exports = router;