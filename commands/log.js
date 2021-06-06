const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const LogMessage = require('../common/logbook-message')


module.exports = {
    commands: 'log',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        const { content, guild ,channel } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 2) {
            return message.reply("Please insert the class code and description.")
        }
        
        const serverID = message.guild.id;

        args.shift()
        console.log(args[0])

        const classCode = args[0]
        const desc = args.slice(1).join(' ')

        if (classCode.length >= 7) {
            return message.reply("Class Code should have 6 characters.")
        }

        console.log('FETCHING FROM DATABASE')
        ClassDB.read(classCode).then((result) => {
            ccache = [
                result.serverID.S,
                result.roleID.S,
                result.channelID.S,
                result.title.S,
                result.image_url.S, 
            ];
        

            console.log('DATA FETCHED')
            const server = ccache[0]
            const assignedRole = ccache[1]
            const room = ccache[2]
            const title = ccache[3]
            const img = ccache[4]
            const type = "vc"

            if(server == serverID) {
                names = message.guild.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)

                console.log(server, serverID, title, assignedRole, room, desc, img)
                messageChannelDB.read(channel.id).then((result) => {
                    const cID = result.channelID.S;
                                 
                    messageChannel = guild.channels.cache.get(cID);
                                          
                    const logmessage = new LogMessage(messageChannel, assignedRole, room, title, desc, img, type);
                    classSize = logmessage.getMapSize(names);
                    logmessage.sendLogBookMessage(names, classSize);
                });
            }
            else {
                return message.reply("Class with that class code does not exist on this server.");
            }
        });
    }
}
