const hwChannels = require('../index.js')

module.exports = {
    commands: 'addhwchannel',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 1) {
            return message.reply("Please insert the channel ID.")
        }

        args.shift()
        channelID = args[0]

        console.log('SAVING NEW CHANNEL')

        hwChannels.push(channelID)

        console.log(channelID);

        return message.channel.send(`Added channel <#${channelID}> as a Homework channel`)
    }
}