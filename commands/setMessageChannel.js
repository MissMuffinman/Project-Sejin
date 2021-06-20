const messageChannelDB = require('../database/messageChannel-db')

module.exports = {
    commands: 'setMessageChannel',
    callback:  async (message) => {

        if (message.author.bot) return
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')

        if (args.length < 1) {
            return message.reply("Please insert the channel ID you wish to set the Message Channel to.")
        }

        cid = channel.id
        args.shift()

        const chanID = args[0]
        console.log(chanID)

        console.log('INSERTING DATA INTO DATABASE')
        messageChannelDB.write(cid, chanID, guild.id);

        message.channel.send("You set the message channel to be: " + chanID)
    }
}