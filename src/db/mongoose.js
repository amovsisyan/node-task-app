const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017';
const database = 'task-manager-api';

mongoose.connect(connectionURL + '/' + database, {
    useNewUrlParser: true,
    useCreateIndex: true
});