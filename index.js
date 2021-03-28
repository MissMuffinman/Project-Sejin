const Discord = require('discord.js')
const mongo = require('./mongo')
const client = new Discord.Client()

const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const HomeworkDB = require('./database/homework-db')
const { db } = require('./schemas/classcodes-schema')
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


// CATCH RAW REACTION
const rawEventTypes = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
};

client.on('raw', async (event) => {
  if (!rawEventTypes[event.t]) return;
  const { d: data } = event;
  const channel = client.channels.cache.get(data.channel_id)
  const message = await channel.messages.fetch(data.message_id);
  let reaction = message.reactions.cache;
  let studentID = message.author.id
  let timestamp = message.createdTimestamp;
  var date = new Date(timestamp);
  var CSTDay = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours() - 5,
    date.getUTCMinutes())
  var CSTTimestamp = Date.parse(CSTDay);

  console.log('INSERTING DATA INTO DATABASE')
  HomeworkDB.write(data.user_id, data.channel_id, CSTTimestamp.toString());

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

  if (reaction.message.reactions.cache.size > 1){
    reaction.users.remove(user.id);
  }
});

client.on('error', console.error);

client.login(token)
