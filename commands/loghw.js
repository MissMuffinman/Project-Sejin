const HomeworkDB = require('../database/homework-db')
const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const LogMessage = require('../common/logbook-message')
const DateValidator = require('../common/logbook-date') 
const client = require("../index.js");

module.exports = {
    commands: 'loghw',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        let cIDcache;
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 5) {
            return message.reply("Please insert the class code, description, start day, start time, end day and end time.")
        }
        
        args.shift()
        console.log(args[0])

        
        const ccid = args[0]
        const description = args.slice(1)
        const time = args.slice(-4);
        const desc = description.join(' ').replace(/ *\([^)]*\) */g, "");
        let startDay = time[0].replace("(", "");
        let startTime = time[1];
        let endDay = time[2];
        let endTime = time[3].replace(")", "");

        const dateValid = new DateValidator();

        if (!dateValid.isValidDate(endDay) || ! dateValid.isValidDate(startDay) || !dateValid.isValidTime(startTime) || ! dateValid.isValidTime(endTime)) {
            return message.reply("Please insert the correct format for dates and time (YYYY/MM/DD HH:MM)")
        }
        startTime = startTime.split(":");
        endTime = endTime.split(":");
        const startHour = startTime[0];
        const startMinutes = startTime[1];
        const endHour = endTime[0];
        const endMinutes = endTime[1];

        startDay = new Date(new Date(startDay).setHours(startHour))
        startDay.setMinutes(startMinutes);
        endDay = new Date(new Date(endDay).setHours(endHour));
        endDay.setMinutes(endMinutes);
        let studentsIDs = [];

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
              result.alternativeRoleID.S
            ];

        
            let riddata = ccache
            const assignedRole = riddata[0]
            const room = riddata[1]
            const title = riddata[2]
            const img = riddata[3]
            const alternativeRole = riddata[4]
            const type = "hw";

            console.log(title, assignedRole, room, desc, img, alternativeRole)
            
            messageChannelDB.read(channel.id).then((result) => {
                if (!result){
                    return message.reply("Please set the Message channel using command setMessageChannel")
                }
                const cID = result.channelID.S;
                const guildID = result.guildID.S;

                const guild = client.guilds.cache.get(guildID);
                messageChannel = guild.channels.cache.get(cID);
                
                HomeworkDB.read(room, JSON.stringify(startDay.getTime()), JSON.stringify(endDay.getTime()))
                .then((result) => {
                  result.forEach(function (element) {
                      studentsIDs.push(element.studentID.S);
                    });
                    console.log('DATA FETCHED')
                    if (studentsIDs.length == 0) {
                        return message.reply("There was no homework submitted during this time period.")
                    }
            
            
                    console.log(title, assignedRole, room, desc, img)              
                    messageChannel = guild.channels.cache.get(cID);
                                          
                    const logmessage = new LogMessage(messageChannel, assignedRole, room, title, desc, img, type, alternativeRole);
                    classSize = logmessage.getMapSize(studentsIDs);
                    logmessage.sendLogBookMessage(studentsIDs, classSize);
                });
            })
    

        });
    }
}