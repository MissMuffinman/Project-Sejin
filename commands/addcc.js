const ClassDB = require('../database/class-db');
const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcc')
        .setDescription('Add a class to the db.')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('The channel')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('The image url for the class')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of class')
                .addChoices(
                    { name:'Class + HW', value: 'full_class' },
                    { name: 'Only meetings', value: 'vc' },
                    { name: 'Only assignments (club)', value: 'hw' }
                )
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number_of_assignments')
                .setDescription('The number of assignments for the class. Add 0 if there are no assignments.')
                .setRequired(false)),
    async execute(interaction) {
        const options = interaction.options;
        const channelIDs = options.getString('channel');
        const roleID = options.getRole('role').id;
        const classTitle = options.getString('title');
        const classCode = options.getString('class_code');
        const imageUrl = options.getString('image_url');
        const type = options.getString('type');
        const numberOfAssignments = options.getInteger('number_of_assignments') || 0;

        await interaction.deferReply();

        const validateChannel = (channel, channelID) => {
            const validChannels = {
                'hw': ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'],
                'vc': ['GUILD_VOICE'],
                'full_class': ['GUILD_VOICE']
            };
            if (!channel) {
                interaction.followUp(`${channelID} is not a valid channel id`);
                return false;
            }
            if (!validChannels[type].includes(channel.type)) {
                interaction.followUp(`Channel type ${channel.type} is not valid for ${type} format. Valid formats are: ${validChannels[type].join(', ')}`);
                return false;
            }
            if (['hw'].includes(type)) {
                const addedChannelCorrectly = DiscordUtil.addHomeworkChannel(channel.id, interaction, classCode);
                if (!addedChannelCorrectly) {
                    return false;
                }
                interaction.channel.send(`Added channel ${channel} (${channel.id}) as a Homework channel`);
            }
            return true;
        };

        if (type === 'hw' && numberOfAssignments === 0) {
            interaction.followUp('For a club, the number of assignments should be greater than 0. <a:shookysad:949689086665437184>');
            return;
        }

        const allChannelIDs = channelIDs.split(' ');
        let validated = true;
        allChannelIDs.forEach(hwChannelID => {
            const hwChannel = interaction.channel.guild.channels.cache.get(hwChannelID);
            if (!validateChannel(hwChannel, hwChannelID)) {
                validated = false;
            }
        });
        if (!validated) {
            return;
        }

        const classChannel = interaction.channel.guild.channels.cache.get(allChannelIDs[0]);
        const sID = classChannel.guild.id;
        console.log(sID);

        ClassDB.getClassCodeByRoleID(roleID)
            .then((result) => {
                if (result && result.classCode.S !== classCode) {
                    return interaction.followUp(`There's already class code ${result.classCode.S} with this role assigned!`);
                } else {
                    console.log('INSERTING DATA INTO DATABASE');
                    ClassDB.write(sID, roleID, channelIDs, classCode, classTitle, imageUrl, numberOfAssignments.toString());
                    return interaction.followUp('You set ' + classCode + ' to be the class code for ' + roleMention(roleID) + '\n The class title is: ' + classTitle + '\nThe class image is: ' + imageUrl);
                }
            });
    }
};