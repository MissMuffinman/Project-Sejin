const got = require('got');
const fs = require('fs');
var path = require("path");
const fileName = '../hwchannels.json';
var pathToJson = path.resolve(__dirname, fileName);
const file = require(pathToJson);


module.exports = {

    getMemberByUsername(message, username){
        var members = message.guild.members.cache;
        var user = message.client.users.cache.find(u => u.tag === username);
        console.log(`yes its me, user ${user}`);
        if(!user){
            return message.reply(`User ${username} not found`);
        }
        userID = user.id;
        return members.get(userID);
    },


    openFileAndDo(url, aFunction, message) {
        (async () => {
            try {
                const response = await got(url);
                console.log(response.body);
                var csv = response.body;
                var usernames = csv.split("\r\n");
                usernames.forEach(username => {
                    console.log(username);
                    var member = module.exports.getMemberByUsername(message, username);
                    aFunction(member);
                });
            } catch (error) {
                console.log(error.response.body);
            }
        })();
    },

    writeToFile(){
        fs.writeFile(pathToJson, JSON.stringify(file), function writeJSON(err) {
            if (err){
                console.log(err);
                return false;
            } 
            console.log(JSON.stringify(file));
            console.log('writing to ' + pathToJson);
        });
    },

    addHomeworkChannel(channelID, message, classCode){
        console.log(channelID);
        if (channelID in file.ids){
            message.followUp(`Channel <#${channelID}> has already been added as a Homework Channel. <a:shookysad:949689086665437184>`)
            return false;
        }
        console.log('SAVING NEW CHANNEL')
        console.log(channelID, classCode);

        file.ids[channelID] = classCode;
        this.writeToFile();
        return true;
    },
    removeHomeworkChannel(channelID, message){
        if (!(channelID in file.ids)){
            message.followUp(`Channel <#${channelID}> has not been added as a Homework Channel. <a:shookysad:949689086665437184>`)
            return false;
        }
        console.log('SAVING NEW CHANNEL')

        delete file.ids[channelID];
        this.writeToFile();
        return true;
    }, 
    getTimeForSavingHomework(message) {
        var timestamp = message.createdTimestamp;
        var date = new Date(timestamp);
        var CSTDay = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours() - 5,
        date.getUTCMinutes())
        return Date.parse(CSTDay);
    },

};
