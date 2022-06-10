const messageChannelDB = require('../database/messageChannel-db');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v9');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmessagechannel')
        .setDescription('This sets the message channel. If the message channel is in another server, add the server ID.')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('regular')
                .setDescription('Set a message channel in this server')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The message channel')
                        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread)
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cross_server')
                .setDescription('Set message channel in another server')
                .addStringOption(option => option.setName('channel_id').setDescription('The channel ID').setRequired(true))
                .addStringOption(option => option.setName('guild_id').setDescription('The server ID').setRequired(true))),
    async execute(interaction) {
        let guildId, messageChannelID;
        const cid = interaction.channel.id;

        if (interaction.options.getSubcommand() === 'regular') {
            guildId = interaction.channel.guild.id;
            messageChannelID = interaction.options.getChannel('channel').id;
        } else if (interaction.options.getSubcommand() === 'cross_server') {
            messageChannelID = interaction.options.getString('channel_id');
            guildId = interaction.options.getString('guild_id');
        }

        await interaction.deferReply();

        console.log('INSERTING DATA INTO DATABASE');
        await messageChannelDB.write(cid, messageChannelID, guildId);

        interaction.followUp('You set the message channel to be: ' + messageChannelID);
    }
};