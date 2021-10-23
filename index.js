const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS'] })

const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const hwChannels = require('./hwchannels.json')
const HomeworkDB = require('./database/homework-db')
const token = (config.token)

client.once('ready', async () => {
    console.log('LogBook is online!')
    client.user.setActivity('BE', { type: 'LISTENING' })

const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')
})

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

  if (!(reaction.message.channel.id in hwChannels.ids)){
    return;
  }
  const classCode = hwChannels.ids[reaction.message.channel.id];
  console.log(classCode);

  if (reaction.emoji.name === 'purple_check_mark' && reaction.message.channel.type === 'text') {
    let timestamp = reaction.message.createdTimestamp;
    const firstEmoji = reaction.message.reactions.cache.values().next().value._emoji.name;
    emojiName = getNameOfEmoji(firstEmoji);
    var date = new Date(timestamp);
    var CSTDay = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() - 5,
      date.getUTCMinutes())
    var CSTTimestamp = Date.parse(CSTDay);
  
    console.log('INSERTING DATA INTO DATABASE')
    const first_promise = await HomeworkDB.write(reaction.message.id, reaction.message.author.id, reaction.message.channel.id, CSTTimestamp.toString(), emojiName, classCode);
    if (first_promise == true){
      reaction.message.react('👍')
    }
    else {
      reaction.message.react('❌')
    }
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
  }      
}

client.on('error', console.error);

client.login(token)
module.exports = client;