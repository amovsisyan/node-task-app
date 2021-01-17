const mongoose = require('mongoose');

const connectionURL = process.env.MONGO_DB_URL;
const database = 'task-manager-api';

mongoose.connect(connectionURL + '/' + database, {
    useNewUrlParser: true,
    useCreateIndex: true
});