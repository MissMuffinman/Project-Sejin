const fs = require('fs');
const { Client, Collection, Intents, Permissions } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ] });

const hwChannels = require('./hwchannels.json')
const HomeworkDB = require('./database/homework-db')

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
	if (interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
		console.log('This member is admin');
	}
	if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
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

	if (user.id === client.user.id){
		return;
	}
	if (!Object.keys(hwChannels.ids).includes(reaction.message.channel.id)){
		return;
	}
	const classCode = hwChannels.ids[reaction.message.channel.id];
	const validHWChannels = ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"]
	if (reaction.emoji.name === 'purple_check_mark' && validHWChannels.includes(reaction.message.channel.type)) {
		const firstEmoji = reaction.message.reactions.cache.values().next().value._emoji.name;
		emojiName = getNameOfEmoji(firstEmoji);
		if (!emojiName) {
			reaction.message.react('❌')
			return;
			}
		var timestamp = reaction.message.createdTimestamp;
		var date = new Date(timestamp);
		var CSTDay = new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours() - 5,
		date.getUTCMinutes())
		var CSTTimestamp = Date.parse(CSTDay);
	
		console.log('INSERTING DATA INTO DATABASE')
		
		const result = await HomeworkDB.write(reaction.message.id, reaction.message.author.id, reaction.message.channel.id, CSTTimestamp.toString(), emojiName, classCode);
		if (result == true){
			reaction.message.react('👍')
		}
		else {
			reaction.message.react('❌')
		}
	}
	else if (reaction.emoji.name == '❌' && reaction.message.channel.type === 'GUILD_TEXT'){
		reaction.message.reactions.removeAll()
	}
});

function getNameOfEmoji(emoji) {
  switch (emoji) {
    case '1️⃣':
		return '1'
    case '2️⃣':
		return '2'
    case '3️⃣':
		return '3'
    case '4️⃣':
		return '4'
    case '5️⃣':
		return '5'
    case '6️⃣':
		return '6'
    case '7️⃣':
		return '7'
    case '8️⃣':
		return '8'
    case '9️⃣':
		return '9'
    case '🔟':
		return '10'
	default:
		return null;
	}      
}

client.login(token);
