const mongo = require('../mongo.js');
const ClassCode = require('../schemas/classcodes-schema');

module.exports = {
    name: 'addClassCode',
    description: 'Add class code',
    args: true,
    execute(message, args) {

        if (args.length < 5) {
            return message.reply('Please insert the class ID, classroom ID, the class code, title, and image.');
        }

        const channelId = args[0];
        console.log(channelId);


        console.log('FETCHING FROM DATABASE');

        // TODO: Probably should just connect to DB once during start up.
        mongo.connectToDB();

        try {
            ClassCode.findOneAndUpdate({
                _id: args[0],
            }, {
                _id: args[0],
                channelID: args[1],
                classCode: args[2],
                title: args[3],
                image_url: args[4],
            }, {
                upsert: true,
            });
        }
        finally {
            // TODO: Figure out a better place to disconnect DB. Probably shouldn't be disconnecting after each request.
            // mongo.disconnect();
        }

        message.channel.send('You set ' + args[2] + ' to be the class code for <@&' + args[0] + '>\nThe class title is: ' + args[3] + '\nThe class image is: ' + args[4]);
    },
};