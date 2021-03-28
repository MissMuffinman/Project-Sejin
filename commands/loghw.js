const mongo = require('../mongo')
const classCodesSchema = require('../schemas/classcodes-schema')
const messageChannelSchema = require('../schemas/messageChannel-schema')
const HomeworkDB = require('../database/homework-db')
const ClassDB = require('../database/class-db')
const LogMessage = require('../common/logbook-message')
const DateValidator = require('../common/logbook-date') 
 

module.exports = {
    commands: 'loghw',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 4) {
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

        if (ccid.length < 7) {
            console.log('FETCHING FROM DATABASE')

        
            ClassDB.read(ccid).then((result) => {
              //console.log(`result's channelID: ${result.channelID.S}`);
              ccache = [
                result.roleID.S,
                result.channelID.S,
                result.title.S,
                result.image_url.S,
              ];

              const cIDcache = "810242287891513384";

              console.log(ccache[0]);
              let riddata = ccache
              //let ciddata = cIDcache
              const cID = cIDcache
              const assignedRole = riddata[0]
              const room = riddata[1]
              const title = riddata[2]
              const img = riddata[3]
              const type = "hw";
      
              HomeworkDB.read(room, JSON.stringify(startDay.getTime()), JSON.stringify(endDay.getTime()))
              .then((result) => {
                result.forEach(function (element) {
                    studentsIDs.push(element.studentID.S);
                    //console.log(element.studentID.S);
                  });
                  console.log('DATA FETCHED')
                  if (studentsIDs.length == 0) {
                      return message.reply("There was no homework submitted during this time period.")
                  }
          
          
                  console.log(title, assignedRole, room, desc, img)
          
          
                  messageChannel = guild.channels.cache.get(cID);
                  
                  const logmessage = new LogMessage(messageChannel, assignedRole, room, title, desc, img, type);
                  classSize = logmessage.getMapSize(studentsIDs);
                  logmessage.sendLogBookMessage(studentsIDs, classSize);
              });
      

            });
        }
    }
}