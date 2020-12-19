const mongoDB = require('mongodb');

const {ObjectID, MongoClient} = mongoDB;

const connectionURL = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Connection error');
    }

    console.log('Connection success');

    const db = client.db(database);
    // db.collection('users').insertOne({
    //     name: 'Bob',
    //     age: 40
    // }, (error, result) => {
    //     if (error) {
    //         console.log('Insertion Error');
    //     }
    //
    //     console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Task 1',
    //         completed: true
    //     },
    //     {
    //         description: 'Task 2',
    //         completed: false
    //     },
    //     {
    //         description: 'Task 3',
    //         completed: true
    //     },
    // ], (error, result) => {
    //     if (error) {
    //         console.log('Insertion Error');
    //     }
    //
    //     console.log(result.ops);
    // });

    // db.collection('users').findOne({name: 'Bob'}, (err, user) => {
    //     if (err) {
    //         console.log('Err');
    //     }
    //
    //     console.log(user);
    // });
    //
    // db.collection('users').findOne({_id: new ObjectID("5f6ae4eba804881b1bae5026")}, (err, user) => {
    //     if (err) {
    //         console.log('Err');
    //     }
    //
    //     console.log(user, 'by obj id');
    // });
    //
    // db.collection('users').find({name: 'Bob'}).toArray((err, users) => {
    //     if (err) {
    //         console.log('Err');
    //     }
    //
    //     console.log(users);
    // });
    //
    // db.collection('users').find({name: 'Bob'}).count((err, count) => {
    //     if (err) {
    //         console.log('Err');
    //     }
    //
    //     console.log(count);
    // });

    db.collection('users').updateOne({_id: new ObjectID("5f6ae4eba804881b1bae5026")}, {
        $set: {
            name: 'Dylan',
            age: 444,
        }
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(`Error: ${err}`);
    })
});