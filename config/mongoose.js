const mongoose = require('mongoose');
const env = require('./environment')
mongoose.connect(`mongodb+srv://vishalm76:${env.db_pass}@majorproject.e7pto.mongodb.net/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;