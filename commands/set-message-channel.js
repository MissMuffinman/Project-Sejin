const mongo = require('../mongo.js');
const MessageChannel = require('../schemas/messageChannel-schema');
const icache = {};

module.exports = {
	name: 'setMessageChannel',
	description: 'Sets the message channel for the Logbook',
	args: true,
	execute(message, args) {

		if (args.length < 1) {
			return message.reply('Please insert the channel ID you wish to set the Message Channel to.');
		}

		const channelId = args[0];
		console.log(channelId);

		let idata = icache[channelId];

		if (!idata) {
			console.log('FETCHING FROM DATABASE');
			// TODO: Probably should just connect to DB once during start up.
			mongo.connectToDB();

			// TODO: Need to update logic here
			try {
				MessageChannel.find({ id: channelId })
					.then(output => {
						console.log(output.channelID);
						icache[channelId] = idata = [output._id, output.channelID];
					});
			}
			finally {
				// TODO: Figure out a better place to disconnect DB. Probably shouldn't be disconnecting after each request.
				// mongo.disconnect();
			}

		}

		message.channel.send('You set the message channel to be: ' + channelId);

	},
};