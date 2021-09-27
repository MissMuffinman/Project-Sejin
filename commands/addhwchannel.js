const DiscordUtil = require('../common/discordutil.js');

module.exports = {
    commands: 'addhwchannel',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 2) {
            return message.reply("Please insert the class code and the channel ID.")
        }

        args.shift()
        cc = args[0]
        channelID = args[1]

        console.log('SAVING NEW CHANNEL')
        var addedChannelCorrectly = DiscordUtil.addHomeworkChannel(channelID, message, cc)
        if (addedChannelCorrectly){
            message.channel.send(`Added channel <#${channelID}> (${channelID}) as a Homework channel`)
        }
    }
}