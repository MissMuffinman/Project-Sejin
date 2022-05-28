const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const ClassDB = require('../database/class-db');
const { ChannelType } = require('discord-api-types/v9');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addhwchannel')
        .setDescription('Add a homework channel to a class')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread)
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options;
        const channelID = options.getChannel('channel').id;
        const classCode = options.getString('class_code');

        await interaction.deferReply();

        ClassDB.read(classCode)
            .then((result) => {
                if (!result) {
                    return interaction.followUp({ content:`Class code ${classCode} not found. <a:shookysad:949689086665437184>` });
                }
                console.log('SAVING NEW CHANNEL');
                const addedChannelCorrectly = DiscordUtil.addHomeworkChannel(channelID, interaction, classCode);
                if (addedChannelCorrectly) {
                    return interaction.followUp(`Added channel <#${channelID}> (${channelID}) as a Homework channel`);
                }
            });
    }
};