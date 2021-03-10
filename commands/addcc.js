const mongo = require('../mongo')
const classCodesSchema = require('../schemas/classcodes-schema')


module.exports = {
    commands: 'addcc',
    callback:  async (message) => {
        const ncache = {}

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 5) {
            return message.reply("Please insert the class ID, classroom ID, the class code, title, and image.")
        }

        args.shift()
        console.log(args[0])
        _id = args[0]
        classCode = args[2]
        title = args[3]
        image_url = [4]

        ncache[_id] = [classCode]

        await mongo().then(async (mongoose) => {
            console.log('INSERTING DATA INTO DATABASE')
            try {
                await classCodesSchema.findOneAndUpdate({
                    _id: args[0]
                }, {
                    _id: args[0],
                    channelID: args[1],
                    classCode: args[2],
                    title: args[3],
                    image_url: args[4]
                }, {
                    upsert: true
                })
            } finally {
                mongoose.connection.close()
            }
        })

        message.channel.send("You set " + args[2] + " to be the class code for <@&" + args[0] + ">\nThe class title is: " + args[3] + "\nThe class image is: " + args[4])
    }
}

