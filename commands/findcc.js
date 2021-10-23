 const ClassDB = require('../database/class-db')


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
        
        console.log('FETCHING FROM DATABASE')
        ClassDB.getClassCodeByRoleID(id).then((result) => {
            message.channel.send("The class code is: " + result.classCode.S);
        })
        
    }   
} 