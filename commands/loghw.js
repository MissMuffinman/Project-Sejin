const HomeworkDB = require('../database/homework-db')
const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const HomeworkLogBook = require('../common/logbook-homework')
const DateValidator = require('../common/logbook-date') 
const client = require("../index.js");

module.exports = {
    commands: 'loghw',
    callback:  async (message, args) => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        if (args.length < 5) {
            return message.reply("Please insert the class code, description, start day, start time, end day and end time.")
        }
        
        console.log("0", args[0])

        
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

        if (ccid.length >= 7) {
            return message.reply("Class Code should have 6 characters")
        }

        periodDayTimes = adaptFormatOfDays(startTime, startDay, endTime, endDay);
        startDay = periodDayTimes[0];
        endDay = periodDayTimes[1];

        let studentsIDs = {};

        console.log('FETCHING FROM DATABASE')

        // Get information from the class using ClassCodeID

        ClassDB.read(ccid).then((result) => {
            classInfo = {
              assignedRole: result.roleID.S,
              channelID: result.channelID.S,
              title: result.title.S,
              img: result.image_url.S,
            };
            const type = "hw"
                        
            //get LogBookChannel ID and GuildID of main server 
            
            messageChannelDB.read(channel.id).then((result) => {
                if (!result){
                    return message.reply("Please set the Message channel using command setMessageChannel")
                }
                const messageChannelID = result.channelID.S;
                const messageChannelGuildID = result.guildID.S;

                const guild = client.guilds.cache.get(messageChannelGuildID);
                messageChannel = guild.channels.cache.get(messageChannelID);
                console.log("cID", classInfo.channelID);
                HomeworkDB.read(classInfo.channelID, startDay, endDay, ccid)
                .then((result) => {
                  result.forEach(function (element) {
                      hwNumber = element.type.S
                      !(hwNumber in studentsIDs) && (studentsIDs[hwNumber] = [])
                      studentsIDs[hwNumber].push(element.studentID.S);
                    });
                    console.log('DATA FETCHED', Object.keys(studentsIDs).length)
                    if (Object.keys(studentsIDs).length == 0) {
                        return message.reply("There was no homework submitted during this time period.")
                    }

                    console.log(studentsIDs);
                    
                    messageChannel = guild.channels.cache.get(messageChannelID);
                    
                    const logmessage = new HomeworkLogBook(messageChannel, classInfo, desc, Object.keys(studentsIDs).length);
                    classSize = logmessage.getMapSize(studentsIDs);
                    logmessage.sendLogBookMessage(studentsIDs, classSize);
                });
            })
    

        });
    
        function adaptFormatOfDays(startTime, startDay, endTime, endDay){
            startTime = startTime.split(":");
            endTime = endTime.split(":");
            const startHour = startTime[0];
            const startMinutes = startTime[1];
            const endHour = endTime[0];
            const endMinutes = endTime[1];

            startDay = new Date(new Date(startDay).setHours(startHour))
            startDay.setMinutes(startMinutes); 
            startDay = JSON.stringify(startDay.getTime());
            endDay = new Date(new Date(endDay).setHours(endHour));
            endDay.setMinutes(endMinutes);
            endDay = JSON.stringify(endDay.getTime())

            return [startDay, endDay];
        }

    
    }
}