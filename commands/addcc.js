const ClassDB = require('../database/class-db')
const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addcc')
		.setDescription('Add a class to the db.')
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addChannelOption(option =>
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
                .addChoice('Class + HW', 'full_class')
                .addChoice('Only meetings', 'vc')
                .addChoice('Only assigments (club)', 'hw')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number_of_assignments')
                .setDescription('The number of assignments for the class. Add 0 if there are no assignments.')
                .setRequired(true)),
	async execute(interaction) {
        const options = interaction.options
        const channelID = options.getChannel('channel').id;
        const roleID = options.getRole('role').id;
        const classTitle = options.getString('title');
        const classCode = options.getString('class_code')
        const imageUrl = options.getString('image_url')
        const type = options.getString('type')
        const numberOfAssignments = options.getInteger('number_of_assignments')
        
        const classChannel = options.getChannel('channel');
        const sID = classChannel.guild.id;
        console.log(sID);
        

        if (classChannel.type == "text" && numberOfAssignments == 0 && ['full_class', 'hw'].includes(type)){
            return interaction.reply(`${channelMention(channelID)} is a text channel. The number of assigments should be greater than 0.`)
        }

        console.log('INSERTING DATA INTO DATABASE')
        ClassDB.write(sID, roleID, channelID, classCode, classTitle, imageUrl, numberOfAssignments.toString())

        console.log(classChannel.type);
        if (classChannel.type == "GUILD_TEXT" && numberOfAssignments > 0){
            var addedChannelCorrectly = DiscordUtil.addHomeworkChannel(channelID, interaction, classCode)
            if (addedChannelCorrectly){
                interaction.channel.send(`Added channel ${channelMention(channelID)} (${channelID}) as a Homework channel`)
            }
        }                                                                    

        
		return interaction.reply("You set " + classCode + " to be the class code for " + roleMention(roleID) + "\n The class title is: " + classTitle + "\nThe class image is: " + imageUrl)
	},
};