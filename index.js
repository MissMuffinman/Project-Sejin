const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const DiscordUtil = require('./common/discordutil');
const wait = require('node:timers/promises').setTimeout;
const { deployCommands } = require('./deploy-commands');

const client = new Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
	]
});

const hwChannels = require('./hwchannels.json');
const HomeworkDB = require('./database/homework-db');
const numberEmojis = require('./emojis.json');

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

	if (interaction.isSelectMenu()) {
		await interaction.deferUpdate();
		await wait(4000);
		const selectMenuName = interaction.customId.split('_')[0];
		const messageId = interaction.customId.split('_')[1];
		if (selectMenuName === 'addhw') {
			interaction.channel.messages.fetch(messageId).then(async (msg) => {
				const classCode = hwChannels.ids[interaction.channelId];
				const hwNumber = interaction.values[0];
				msg.react(numberEmojis.emojis[hwNumber - 1]);
				const result = await saveHomeworkToDB(msg, hwNumber, classCode);

				if (result) {
					await interaction.editReply({ content: `The homework has been registered as assignment number ${interaction.values.join(', ')}! <a:btshooky_thumbsup:854135650294169610> `, components: [] });
				} else {
					await interaction.editReply({ content: 'Oops! There was a problem registering this assignment. <a:btshooksad:802306534721191956>', components: [] });
				}
			});
		}
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
	const emojiName = reaction.emoji.name;
	const cleanEmojiName = emojiName.replace(/\d/g, '').replace(/_/g, '').toLowerCase();

	if (cleanEmojiName === 'purplecheckmark') {
		const firstEmoji = message.reactions.cache.values().next().value._emoji.name;
		const assignmentNumber = DiscordUtil.getNameOfEmoji(firstEmoji);
		if (!assignmentNumber) {
			message.react('❌');
			return;
		}
		await saveHomeworkToDB(message, assignmentNumber, classCode);
		return;
	}

	if (emojiName === '⏭️') {
		const nextEmojis = numberEmojis.emojis.slice(10, 20);
		nextEmojis.forEach((emoji) => {
			message.react(emoji);
		});
		return;
	}

	const fullEmojiId = `<:${emojiName}:${reaction.emoji.id}>`;
	const isStoredNumberEmoji = numberEmojis.emojis.includes(fullEmojiId);
	if (isStoredNumberEmoji) {
		message.reactions.removeAll();
		message.react(fullEmojiId);
		await saveHomeworkToDB(message, emojiName, classCode);
		return;
	}

	if (emojiName === '❗') {
		message.reactions.removeAll();
	}
});

const saveHomeworkToDB = async (message, assignmentNumber, classCode) => {
	const channelId = message.channel.id;
	const messageId = message.id;
	const authorId = message.author.id;
	const timestamp = DiscordUtil.getTimeForSavingHomework(message);

	const result = await HomeworkDB.write(messageId, authorId, channelId, timestamp, assignmentNumber, classCode);
	if (result === true) {
		message.react('👍');
	} else {
		message.react('❌');
	}
	return result;
};

client.login(token);
