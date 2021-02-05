const mongoose = require('mongoose');
const { mongoPath } = require('./config.json');

module.exports = {
    connectToDB: function() {
        mongoose.connect(mongoPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const database = mongoose.connection;

        database.on('error', console.error.bind(console, 'connection error:'));
        database.once('open', function() {
            console.log('MongoDB database connection established successfully.');
            return database;
        });
    },

    disconnect: function() {
        mongoose.connection.close();
    },
};

