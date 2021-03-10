const mongo = require('../mongo')
const messageChannelSchema = require('../schemas/messageChannel-schema')

module.exports = {
    commands: 'setMessageChannel',
    callback:  async (message) => {
    
        const icache = {}

        if (message.author.bot) return
        const { content, channel } = message
        let text = content
        const args = text.split(' ')

        if (args.length < 1) {
            return message.reply("Please insert the channel ID you wish to set the Message Channel to.")
        }

        cid = channel.id
        args.shift()

        const chanID = args[0]
        console.log(chanID)

        let idata = icache[cid]

        console.log('FETCHING FROM DATABASE')

        await mongo().then(async (mongoose) => {
            try {
                const output = await messageChannelSchema.findOneAndUpdate({
                    _id: cid
                }, {
                    _id: cid,
                    channelID: chanID
                }, {
                    upsert: true
                })
                console.log(output.channelID)
                icache[cid] = idata = [output._id, output.channelID]
            } finally {
                mongoose.connection.close()
            }
        })

        message.channel.send("You set the message channel to be: " + chanID)
    }
}