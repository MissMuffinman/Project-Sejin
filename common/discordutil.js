const got = require('got');
const fs = require('fs');
const path = require('path');
const fileName = '../hwchannels.json';
const pathToJson = path.resolve(__dirname, fileName);
const file = require(pathToJson);


module.exports = {
    getMemberByUsername(message, username) {
        const members = message.guild.members.cache;
        const user = message.client.users.cache.find(u => u.tag === username);
        console.log(`yes its me, user ${user}`);
        if (!user) {
            return message.reply(`User ${username} not found`);
        }
        const userID = user.id;
        return members.get(userID);
    },

    openFileAndDo(url, aFunction, message) {
        (async () => {
            try {
                const response = await got(url);
                console.log(response.body);
                const csv = response.body;
                const usernames = csv.split('\r\n');
                usernames.forEach(username => {
                    console.log(username);
                    const member = module.exports.getMemberByUsername(message, username);
                    aFunction(member);
                });
            } catch (error) {
                console.log(error.response.body);
            }
        })();
    },

    writeToFile() {
        fs.writeFile(pathToJson, JSON.stringify(file), function writeJSON(err) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log(JSON.stringify(file));
            console.log('writing to ' + pathToJson);
        });
    },

    addHomeworkChannel(channelID, message, classCode) {
        console.log(channelID);
        if (channelID in file.ids) {
            message.followUp(`Channel <#${channelID}> has already been added as a Homework Channel. <a:shookysad:949689086665437184>`);
            return false;
        }
        console.log('SAVING NEW CHANNEL');
        console.log(channelID, classCode);

        file.ids[channelID] = classCode;
        this.writeToFile();
        return true;
    },

    removeHomeworkChannel(channelID, message) {
        if (!(channelID in file.ids)) {
            message.followUp(`Channel <#${channelID}> has not been added as a Homework Channel. <a:shookysad:949689086665437184>`);
            return false;
        }
        console.log('SAVING NEW CHANNEL');

        delete file.ids[channelID];
        this.writeToFile();
        return true;
    },

    getTimeForSavingHomework(message) {
        const date = new Date(message.createdTimestamp);
        const CSTDay = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours() - 5,
            date.getUTCMinutes());
        return Date.parse(CSTDay).toString();
    },

    getNameOfEmoji(emoji) {
        switch (emoji) {
            case '1️⃣':
                return '1';
            case '2️⃣':
                return '2';
            case '3️⃣':
                return '3';
            case '4️⃣':
                return '4';
            case '5️⃣':
                return '5';
            case '6️⃣':
                return '6';
            case '7️⃣':
                return '7';
            case '8️⃣':
                return '8';
            case '9️⃣':
                return '9';
            case '🔟':
                return '10';
            default:
                return null;
        }
    }
};
