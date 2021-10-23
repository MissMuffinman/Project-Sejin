const ClassDB = require('../database/class-db')
const DiscordUtil = require('../common/discordutil.js');

module.exports = {
    commands: 'addcc',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 5) {
            return message.reply("Please insert the class ID, classroom ID, the class code, title, number of assignments and image.")
        }

        args.shift()
        rID = args[0]
        cID = args[1]
        cc = args[2]
        classTitle = args[3]
        var numberOfHomeworks = args[4];
        url = args[5]
        var sID;
        console.log(args.length);

        if (args.length > 5) {
            sID = args[6]
        }

        allChannelIDs = cID.split("_")  
        allChannelIDs.forEach(hwChannelID => {
            var hwChannel = message.channel.guild.channels.cache.get(hwChannelID); 
            if (!hwChannel && !sID) {
                return message.reply(`${hwChannelID} is not a valid channel Id from this server. If this channel is from another server, please add the Server ID after the image link.`)
            }
            if (hwChannel && hwChannel.type == "text" && numberOfHomeworks == 0) {
                return message.reply(`<#${cID}> is a text channel. The number of assigments should be greater than 0.`)
            }
            if (numberOfHomeworks > 0){
                var addedChannelCorrectly = DiscordUtil.addHomeworkChannel(hwChannelID, message, cc)
                if (addedChannelCorrectly){
                    message.channel.send(`Added channel <#${hwChannelID}> (${hwChannelID}) as a Homework channel`)
                }
            }  
        })

        if (!sID){
            sID = message.guild.id;
        }

        console.log('INSERTING DATA INTO DATABASE')
        ClassDB.write(sID, rID, cID, cc, classTitle, url, numberOfHomeworks.toString())

        message.channel.send("You set " + cc + " to be the class code for <@&" + rID + ">\nThe class title is: " + classTitle + "\nThe class image is: " + url)
    }
}