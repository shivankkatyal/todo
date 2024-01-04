const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/TODO_list_db');

const db = mongoose.connection;

db.on('error', console.error.bind(console,'error connecting to database'));

db.once('open', function(){
    console.log('Successfully connected to the database');
});

module.exports = db;