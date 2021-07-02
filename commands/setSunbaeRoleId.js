const fs = require('fs');
var path = require("path");
const fileName = '../config.json';
var pathToJson = path.resolve(__dirname, fileName);
const file = require(pathToJson);

module.exports = {
    commands: 'setsunbaerole',
    callback:  async (message) => {

        if (message.author.bot) return
        const { content, channel } = message
        let text = content
        const args = text.split(' ')

        if (args.length < 2) {
            return message.reply("Please add roleID")
        }

        args.shift()

        const roleID = args[0];
        file.sunbaeRole = roleID;
    
        fs.writeFile(pathToJson, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
        console.log('writing to ' + pathToJson);
        });
    }
}