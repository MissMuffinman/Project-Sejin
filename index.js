const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const DiscordUtil = require('./common/discordutil');
const wait = require('node:timers/promises').setTimeout;

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
const numberEmojis = require('./emojis.json');

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
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
				const CSTTimestamp = DiscordUtil.getTimeForSavingHomework(msg);
				const result = await saveHomeworkToDB(msg, CSTTimestamp, interaction.values[0], classCode)

				if (result) {
					await interaction.editReply({ content: `The homework has been registered as assignment number ${interaction.values.join(', ')}! <a:btshooky_thumbsup:854135650294169610> `, components: [] });
				}
				else {
					await interaction.editReply({ content: 'Oops! There was a problem registering this assignment. <a:btshooksad:802306534721191956>', components: []});
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

	const emojis = reaction.message.guild.emojis.cache;

	const validHWChannels = ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'];

	if (reaction.emoji.name == '⏭️' && validHWChannels.includes(reaction.message.channel.type)) {
		for (let i = 0; i < 5; i++) {
			reaction.message.react(numberEmojis.emojis[i]);
		}
	}

	if (user.id === client.user.id) {
		return;
	}

	if (!Object.keys(hwChannels.ids).includes(reaction.message.channel.id)) {
		return;
	}
	const classCode = hwChannels.ids[reaction.message.channel.id];
	const emojiReactionName = reaction.emoji.name;
	const emojiId = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
	let CSTTimestamp;
	if (emojiReactionName === 'purple_check_mark' && validHWChannels.includes(reaction.message.channel.type)) {
		const firstEmoji = reaction.message.reactions.cache.values().next().value._emoji.name;
		const emojiName = getNameOfEmoji(firstEmoji);
		if (!emojiName) {
			reaction.message.react('❌');
			return;
			}
		CSTTimestamp = DiscordUtil.getTimeForSavingHomework(reaction.message);

		console.log('INSERTING DATA INTO DATABASE');
		saveHomeworkToDB(reaction.message, CSTTimestamp, emojiName, classCode);
	} else if (reaction.emoji.name == '❗' && validHWChannels.includes(reaction.message.channel.type)) {
		reaction.message.reactions.removeAll();
	} else if (numberEmojis.emojis.includes(emojiId) && validHWChannels.includes(reaction.message.channel.type)) {
		CSTTimestamp = DiscordUtil.getTimeForSavingHomework(reaction.message);
		saveHomeworkToDB(reaction.message, CSTTimestamp, emojiReactionName, classCode);
	}
});

function getNameOfEmoji(emoji) {
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
}

async function saveHomeworkToDB(message, CSTTimestamp, emojiName, classCode) {
	console.log(message.id, message.author.id, message.channel.id, CSTTimestamp.toString(), emojiName, classCode);
	const result = await HomeworkDB.write(message.id, message.author.id, message.channel.id, CSTTimestamp.toString(), emojiName, classCode);
	if (result == true) {
		message.react('👍');
	} else {
		message.react('❌');
	}
}

client.login(token);
