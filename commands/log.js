const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
const ClassDB = require('../database/class-db')
const messageChannelDB = require('../database/messageChannel-db')
const VCLogBook = require('../common/logbook-vc')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('Log a class in the message channel.')
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description included in the logbook message')
                .setRequired(true)),
	async execute(interaction) {
        const options = interaction.options
        const classCode = options.getString('class_code')
        const desc = options.getString('description')

        if (classCode.length >= 7) {
            return interaction.reply("Class Code should have 6 characters.")
        }

        console.log(interaction.channel.guild.id)
        console.log(interaction.client);

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


            const vcServer = interaction.client.guilds.cache.get(vcServerID);


            names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)

            if (names.length == 0) {
                return interaction.reply(`There is no one on vc with role <@&${assignedRole}>`)
            }
            //get LogBookChannel ID and GuildID of main server
            messageChannelDB.read(interaction.channel.id).then((result) => {
                const messageChannelID = result.channelID.S;
                const messageChannelGuildID = result.guildID.S;

                
                const guild = interaction.client.guilds.cache.get(messageChannelGuildID);
                messageChannel = guild.channels.cache.get(messageChannelID);
                console.log(messageChannel);
                                          
                const logmessage = new VCLogBook(messageChannel, classInfo, desc);
                classSize = logmessage.getMapSize(names);
                logmessage.sendLogBookMessage(names, classSize);
                interaction.reply("Logbook posted!")
            });          
        });


	},
};