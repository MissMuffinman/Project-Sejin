const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
const ClassDB = require('../database/class-db');
const messageChannelDB = require('../database/messageChannel-db');
const VCLogBook = require('../common/logbook-vc');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription('Log a class in the message channel.')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description included in the logbook message')
                .setRequired(false)),
    async execute(interaction) {
        const options = interaction.options;
        const classCode = options.getString('class_code');
        const desc = options.getString('description') || '';

        await interaction.deferReply();

        if (classCode.length >= 7) {
            return interaction.followUp('Class Code should have 6 characters.');
        }

        console.log(interaction.channel.guild.id);
        console.log(interaction.client);

        console.log('FETCHING FROM DATABASE');
        ClassDB.read(classCode)
            .then((result) => {
                if (!result) {
                    return interaction.followUp(`Class code ${classCode} not found. <a:shookysad:949689086665437184>`);
                }

                const classInfo = {
                    assignedRole: result.roleID.S,
                    channelID: result.channelID.S,
                    title: result.title.S,
                    img: result.image_url.S,
                    serverID: result.serverID.S
                };

                console.log('DATA FETCHED');
                const assignedRole = classInfo.assignedRole;
                const room = classInfo.channelID;
                const vcServerID = classInfo.serverID;
                const vcServer = interaction.client.guilds.cache.get(vcServerID);

                const names = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id);
                if (names.length === 0) {
                    interaction.followUp(`There is no one on vc ${channelMention(room)} with role ${roleMention(assignedRole)} <a:shookysad:949689086665437184>`);
                }

                // get LogBookChannel ID and GuildID of main server
                messageChannelDB.read(interaction.channel.id)
                    .then((channel) => {
                        const messageChannelID = channel.channelID.S;
                        const messageChannelGuildID = channel.guildID.S;
                        const guild = interaction.client.guilds.cache.get(messageChannelGuildID);
                        const messageChannel = guild.channels.cache.get(messageChannelID);
                        console.log(messageChannel);

                        const logMessage = new VCLogBook(messageChannel, classInfo, desc);
                        const classSize = logMessage.getMapSize(names);
                        if (desc.length > 0 || classSize > 0) {
                            logMessage.sendLogBookMessage(names, classSize);
                            interaction.followUp('Logbook posted!');
                        }
                    });
            });
    }
};