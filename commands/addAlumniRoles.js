const { MessageAttachment } = require('discord.js');
const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
const ClassDB = require('../database/class-db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addalumniroles')
        .setDescription('Adds an alumni role to a class in the voice channel.')
        .setDefaultPermission(false)
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('alumni_role')
                .setDescription('The alumni role to be added to the users')
                .setRequired(false)),
    async execute(interaction) {
        const options = interaction.options;
        const classCode = options.getString('class_code');
        const roleToAssign = options.getRole('alumni_role');

        await interaction.deferReply();

        if (classCode.length >= 7) {
            return interaction.editReply('Class Code should have 6 characters.');
        }

        ClassDB.read(classCode)
            .then((result) => {
                if (!result) {
                    return interaction.editReply(`Class code ${classCode} not found. <a:shookysad:949689086665437184>`);
                }

                const classInfo = {
                    assignedRole: result.roleID.S,
                    channelID: result.channelID.S,
                    title: result.title.S,
                    img: result.image_url.S,
                    serverID: result.serverID.S
                };

                const assignedRole = classInfo.assignedRole;
                const room = classInfo.channelID;
                const vcServerID = classInfo.serverID;
                const vcServer = interaction.client.guilds.cache.get(vcServerID);

                const members = vcServer.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole));
                if (members.length === 0) {
                    return interaction.editReply(`There is no one on vc ${channelMention(room)} with role ${roleMention(assignedRole)}> <a:shookysad:949689086665437184>`);
                }

                let membersWithRole = '';
                members.forEach(member => {
                    member.roles.add([roleToAssign]);
                    membersWithRole += `<@${member.user.id}>\n`;
                });
                const attachment = new MessageAttachment(Buffer.from(membersWithRole, 'utf-8'), 'usersID.txt');
                return interaction.editReply({ content: `Added role ${roleToAssign} to ${roleMention(assignedRole)} class users in VC ${channelMention(room)}`, files: [attachment] });
            });
    }
};