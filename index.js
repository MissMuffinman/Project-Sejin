const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { deployCommands } = require('./deploy-commands');

const client = new Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const hwChannels = require('./hwchannels.json');
const HomeworkDB = require('./database/homework-db');

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	deployCommands();
	client.user.setActivity('Proof', { type: 'LISTENING' });
});

client.on('interactionCreate', async interaction => {
	if (interaction.isContextMenu()) {
		await interaction.deferReply({ ephemeral: true });
		const command = client.commands.get(interaction.commandName);
		if (command) command.execute(interaction);
	}
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (user.id === client.user.id) {
		return;
	}

	const message = reaction.message;
	const channelId = message.channel.id;
	const channelType = message.channel.type;
	const messageId = message.id;
	const authorId = message.author.id;

	const isAValidHwChannel = Object.keys(hwChannels.ids).includes(channelId);
	if (!isAValidHwChannel) {
		return;
	}

	const validHWChannelTypes = ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'];
	const isAValidHwChannelType = validHWChannelTypes.includes(channelType);

	if (!isAValidHwChannelType) {
		return;
	}

	const classCode = hwChannels.ids[channelId];
	const emojiReactionName = reaction.emoji.name.replace(/\d/g, '');
	if (emojiReactionName === 'purple_check_mark') {
		const firstEmoji = message.reactions.cache.values().next().value._emoji.name;
		const emojiName = getNameOfEmoji(firstEmoji);
		if (!emojiName) {
			message.react('❌');
			return;
		}
		const timestamp = getCTTimestamp(message.createdTimestamp);

		console.log('INSERTING DATA INTO DATABASE');

		const result = await HomeworkDB.write(messageId, authorId, channelId, timestamp, emojiName, classCode);
		if (result === true) {
			message.react('👍');
		} else {
			message.react('❌');
		}
	} else if (reaction.emoji.name === '❗') {
		message.reactions.removeAll();
	} else if (reaction.emoji.name === '‼️') {
		message.reactions.removeAll();

		console.log(`REMOVING DATA FROM DATABASE, messageId ${messageId}, classCode ${classCode}`);
		await HomeworkDB.remove(messageId, classCode);
	}
});

const getNameOfEmoji = (emoji) => {
	switch (emoji) {
		case '1️⃣':
			return '1';
		case '2️⃣':
			return '2';
		case '3️⃣':
			return '3';
		case '4️⃣':
			return '4';
		case '5️⃣':
			return '5';
		case '6️⃣':
			return '6';
		case '7️⃣':
			return '7';
		case '8️⃣':
			return '8';
		case '9️⃣':
			return '9';
		case '🔟':
			return '10';
		default:
			return null;
	}
};

const getCTTimestamp = (timestamp) => {
	const date = new Date(timestamp);
	const CSTDay = new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours() - 5,
		date.getUTCMinutes());
	const parsedTimestamp = Date.parse(CSTDay.toString());
	return parsedTimestamp.toString();
};

client.login(token);
