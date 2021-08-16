const messageChannelDB = require('../database/messageChannel-db')

module.exports = {
    commands: 'setMessageChannel',
    callback:  async (message) => {

        if (message.author.bot) return
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        var guildId;

        if (args.length < 1) {
            return message.reply("Please insert the channel ID you wish to set the Message Channel to.")
        }

        cid = channel.id
        args.shift()

        const chanID = args[0]
        console.log(chanID)

        if (args.length > 1) {
            guildId = args[1]
        }

        const messageChannel = message.channel.guild.channels.cache.get(chanID);
        
        if (!messageChannel && !guildId){
            return message.reply(`${chanID} is not a valid channel Id from this server. If this channel is from another server, please add the Server ID after the channel ID.`)
        }
        
        if (!guildId){
            guildId = guild.id
        }

        console.log('INSERTING DATA INTO DATABASE')
        messageChannelDB.write(cid, chanID, guildId);

        message.channel.send("You set the message channel to be: " + chanID)
    }
}