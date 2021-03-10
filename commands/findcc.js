const mongo = require('../mongo')
const classCodesSchema = require('../schemas/classcodes-schema')


module.exports = {
    commands: 'findcc',
    callback:  async (message) => {

    const ncache = {}
    
    if (message.author.bot) return

        const { content } = message
        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 2) {
            return message.reply("Please input the role id.")
        }

        args.shift()
        console.log(args[0])
        id = args[0]
        let data = ncache[id]

        if (!data) {
            console.log('FETCHING FROM DATABASE')
            await mongo().then(async (mongoose) => {
                try {
                    const result = await classCodesSchema.findById(id)

                    ncache[id] = data = [result.classCode]
                } finally {
                    mongoose.connection.close()
                }

            })
        }

        const cc = data[0]
        message.channel.send("The class code is: " + cc)
    }   
}