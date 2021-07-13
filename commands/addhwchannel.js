// file system module to perform file operations
const fs = require('fs');
var path = require("path");
const fileName = '../hwchannels.json';
var pathToJson = path.resolve(__dirname, fileName);
const file = require(pathToJson);

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

        if (file.ids.includes(channelID)){
            message.reply(`Channel <#${channelID}> has already been added as a Homework Channel.`)
        }

        console.log('SAVING NEW CHANNEL')

        file.ids.push(channelID);
    
        fs.writeFile(pathToJson, JSON.stringify(file), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file));
            console.log('writing to ' + pathToJson);
            });

        console.log(channelID);

        return message.channel.send(`Added channel <#${channelID}> as a Homework channel`)
    }
}