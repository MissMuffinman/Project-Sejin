const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
const HomeworkDB = require('../database/homework-db')
const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const VCLogBook = require('../common/logbook-vc')
const DateValidator = require('../common/logbook-date') 

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loghwclass')
		.setDescription('Log a class in the message channel.')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('start_date')
                .setDescription('The first day to log in the logbook (Format YYYY/MM/DD)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('start_time')
                .setDescription('Add the time for when to start looking homework (Format HH:MM)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end_date')
                .setDescription('The last day to log in the logbook (Format YYYY/MM/DD)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end_time')
                .setDescription('Add the time for when to top looking homework (Format HH:MM)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description on the top of message')
                .setRequired(false)),
	async execute(interaction) {
        const options = interaction.options;

        let startDay = options.getString('start_date');
        let startTime = options.getString('start_time');
        let endDay = options.getString('end_date');
        let endTime = options.getString('end_time');
        const classCode = options.getString('class_code');
        const desc = options.getString('description') || "";
        
        const dateValid = new DateValidator();

        if (!dateValid.isValidDate(endDay) || ! dateValid.isValidDate(startDay) || !dateValid.isValidTime(startTime) || ! dateValid.isValidTime(endTime)) {
            return interaction.reply("Please insert the correct format for dates and time (YYYY/MM/DD HH:MM)")
        }

        if (classCode.length >= 7) {
            return interaction.reply("Class Code should have 6 characters.")
        }
        dateValid.adaptFormatOfDays(startTime, startDay, endTime, endDay);

        periodDayTimes = dateValid.adaptFormatOfDays(startTime, startDay, endTime, endDay);
        startDay = periodDayTimes[0];
        endDay = periodDayTimes[1];

        let studentsSubmittedHw = [];

        console.log('FETCHING FROM DATABASE')

        // Get information from the class using ClassCodeID
                

        ClassDB.read(classCode).then((result) => {
            classInfo = {
                assignedRole: result.roleID.S,
                channelID: result.channelID.S,
                title: result.title.S,
                img: result.image_url.S,
                serverID: result.serverID.S
            };

            console.log('DATA FETCHED')

            const assignedRole = classInfo.assignedRole;
            const room = classInfo.channelID;
            
            const vcServerID = classInfo.serverID;


            const vcServer = interaction.client.guilds.cache.get(vcServerID);
            
            console.log(assignedRole);
            console.log(room);
            
            const names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id);
            console.log(names);
            
            if (names.length == 0) {
                return interaction.reply(`There is no one on vc ${channelMention(room)} with role ${roleMention(assignedRole)}> <a:shookysad:949689086665437184>`)
            }

            //get LogBookChannel ID and GuildID of main server
            messageChannelDB.read(interaction.channel.id).then((result) => {
                const messageChannelID = result.channelID.S;
                const messageChannelGuildID = result.guildID.S;

                
                const guild = interaction.client.guilds.cache.get(messageChannelGuildID);
                messageChannel = guild.channels.cache.get(messageChannelID);

                // Search in the db for all the homework submitted and checked during a period of time

                HomeworkDB.read(classInfo.channelID, startDay, endDay, classCode)
                .then((result) => {
                    console.log(result);
                  result.forEach(function (element) {
                      studentsSubmittedHw.push(element.studentID.S);
                    });
                    console.log('DATA FETCHED ', Object.keys(studentsSubmittedHw).length)
                    if (Object.keys(studentsSubmittedHw).length == 0) {
                        return interaction.reply("There was no homework submitted during this time period.")
                    }
                                        
                    messageChannel = guild.channels.cache.get(messageChannelID);

                    const finalNames = names.filter(name => studentsSubmittedHw.includes(name));
                    
                    const logmessage = new VCLogBook(messageChannel, classInfo, desc);
                    classSize = logmessage.getMapSize(finalNames);
                    logmessage.sendLogBookMessage(finalNames, classSize);
                    interaction.reply("Logbook posted!")
                });
            });          
        });


	},
};