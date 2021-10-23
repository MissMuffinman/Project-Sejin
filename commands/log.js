const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const VCLogBook = require('../common/logbook-vc')
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
            classInfo = {
                assignedRole: result.roleID.S,
                channelID: result.channelID.S,
                title: result.title.S,
                img: result.image_url.S,
                serverID: result.serverID.S
            };

            console.log('DATA FETCHED')
            const assignedRole = classInfo.assignedRole
            const room = classInfo.channelID
            
            const vcServerID = classInfo.serverID
            const type = "vc"


            const vcServer = client.guilds.cache.get(vcServerID);


            names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)

            
            //get LogBookChannel ID and GuildID of main server
            messageChannelDB.read(channel.id).then((result) => {
                const messageChannelID = result.channelID.S;
                const messageChannelGuildID = result.guildID.S;

                
                const guild = client.guilds.cache.get(messageChannelGuildID);
                messageChannel = guild.channels.cache.get(messageChannelID);
                console.log(messageChannel);
                                          
                const logmessage = new VCLogBook(messageChannel, classInfo, desc);
                classSize = logmessage.getMapSize(names);
                logmessage.sendLogBookMessage(names, classSize);
            });          
        });
    }
}
