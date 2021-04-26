const ClassDB = require('../database/class-db')
const LogMessage = require('../common/logbook-message')


module.exports = {
    commands: 'log',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 2) {
            return message.reply("Please insert the class code and description.")
        }
        
        args.shift()
        console.log(args[0])

        const ccid = args[0]
        const description = args.slice(1)
        const desc = description.join(' ')

        if (ccid.length >= 7) {
            return message.reply("Class Code should have 6 characters")
        }

        console.log('FETCHING FROM DATABASE')
        ClassDB.read(ccid).then((result) => {
            ccache = [
                result.roleID.S,
                result.channelID.S,
                result.title.S,
                result.image_url.S, 
            ]
        })

        console.log('DATA FETCHED')
        const assignedRole = ccache[0]
        const room = ccache[1]
        const title = ccache[2]
        const img = ccache[3]
        const type = "vc"

        console.log(title, assignedRole, room, desc, img)

        names = message.guild.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)

        classSize = getMapSize(names)
        console.log(classSize)
        console.log(names)
        list = mentionList(names)

        console.log(title, assignedRole, room, desc, img)              
        messageChannel = guild.channels.cache.get(cID);
                                          
        const logmessage = new LogMessage(messageChannel, assignedRole, room, title, desc, img, type);
        classSize = logmessage.getMapSize(studentsIDs);
        logmessage.sendLogBookMessage(studentsIDs, classSize);
    }
}
