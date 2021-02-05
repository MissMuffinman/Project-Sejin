const mongo = require('../mongo.js');
const ClassCode = require('../schemas/classcodes-schema');
const icache = {};

module.exports = {
    name: 'findClassCode',
    description: 'Find class code',
    args: true,
    execute(message, args) {

        if (args.length < 1) {
            return message.reply('Please input the role id.');
        }

        const channelId = args[0];
        console.log(channelId);
        let data = icache[channelId];

        if (!data) {
            console.log('FETCHING FROM DATABASE');

            // TODO: Probably should just connect to DB once during start up.
            mongo.connectToDB();

            try {
                ClassCode.findById(channelId)
                    .then(output => {
                        console.log(output.channelID);
                        icache[channelId] = data = [output.classCode];
                    });
            }
            finally {
                // TODO: Figure out a better place to disconnect DB. Probably shouldn't be disconnecting after each request.
                // mongo.disconnect();
            }
        }

        const classCode = data[0];
        message.channel.send('The class code is: ' + classCode);
    },
};