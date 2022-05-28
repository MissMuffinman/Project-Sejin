const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v9');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removehwchannel')
        .setDescription('Remove a homework channel')
        .setDefaultPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread)
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options;
        const channelID = options.getChannel('channel').id;

        await interaction.deferReply();

        console.log('SAVING NEW CHANNEL');
        const removedChannelCorrectly = DiscordUtil.removeHomeworkChannel(channelID, interaction);
        if (removedChannelCorrectly) {
            return interaction.followUp(`Removed channel <#${channelID}> (${channelID}) as a Homework channel`);
        }
    }
};