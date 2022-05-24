const ClassDB = require('../database/class-db');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findcc')
        .setDescription('Find a classcode using a role')
        .setDefaultPermission(false)
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role of the class')
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options;
        const roleId = options.getRole('role').id;

        await interaction.deferReply();

        console.log('FETCHING FROM DATABASE');
        ClassDB.getClassCodeByRoleID(roleId).then((result) => {
            return interaction.followUp('The class code is: ' + result.classCode.S);
        });
    }
};