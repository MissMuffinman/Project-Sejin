const DiscordUtil = require('../common/discordutil.js');

module.exports = {
    commands: 'removehwchannel',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 2) {
            return message.reply("Please insert the channel ID.")
        }

        args.shift()
        channelID = args[0]

        console.log('SAVING NEW CHANNEL')
        var addedChannelCorrectly = DiscordUtil.removeHomeworkChannel(channelID, message)
        if (addedChannelCorrectly){
            message.channel.send(`Removed channel <#${channelID}> (${channelID}) as a Homework channel`)
        }
    }
}