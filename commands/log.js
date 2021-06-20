const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const LogMessage = require('../common/logbook-message')
var client = require("../index.js");

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
                result.roleID.S,
                result.channelID.S,
                result.title.S,
                result.image_url.S, 
                result.alternativeRoleID.S, 
                result.serverID.S
            ];
        

            console.log('DATA FETCHED')
            const assignedRole = ccache[0]
            const room = ccache[1]
            const title = ccache[2]
            const img = ccache[3]
            const alternativeRole = ccache[4]
            const vcServerID = ccache[5]
            const type = "vc"

            console.log(title, assignedRole, room, desc, img, alternativeRole)

            const vcServer = client.guilds.cache.get(vcServerID);


            names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)


            if (names.length == 0 || !names){
                names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(alternativeRole)).map(m => m.user.id)
            }
            
            //get LogBookChannel ID and GuildID of main server
            messageChannelDB.read(channel.id).then((result) => {
                const channelID = result.channelID.S;
                const guildID = result.guildID.S;

                const guild = client.guilds.cache.get(guildID);
                messageChannel = guild.channels.cache.get(channelID);
                                          
                const logmessage = new LogMessage(messageChannel, assignedRole, room, title, desc, img, type, alternativeRole);
                classSize = logmessage.getMapSize(names);
                logmessage.sendLogBookMessage(names, classSize);
            });          
        });
    }
}
