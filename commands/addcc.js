const ClassDB = require('../database/class-db')
const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder, roleMention, channelMention } = require('@discordjs/builders');
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
                .addChoice('Class + HW', 'full_class')
                .addChoice('Only meetings', 'vc')
                .addChoice('Only assigments (club)', 'hw')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('number_of_assignments')
                .setDescription('The number of assignments for the class. Add 0 if there are no assignments.')
                .setRequired(true)),
	async execute(interaction) {
        const validHWChannels = ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"]
        const options = interaction.options;
        const channelIDs = options.getString('channel');
        const roleID = options.getRole('role').id;
        const classTitle = options.getString('title');
        const classCode = options.getString('class_code')
        const imageUrl = options.getString('image_url')
        const type = options.getString('type')
        const numberOfAssignments = options.getInteger('number_of_assignments')

        await interaction.deferReply()

        const validateChannel = (classChannel) => {
            if (validHWChannels.includes(classChannel.type) && numberOfAssignments == 0 && ['full_class', 'hw'].includes(type)){
                return interaction.followUp(`${channelMention(classChannel)} is a text channel. The number of assigments should be greater than 0.`)
            }
            console.log(classChannel.type);
            if (validHWChannels.includes(classChannel.type)){
                var addedChannelCorrectly = DiscordUtil.addHomeworkChannel(classChannel.id, interaction, classCode)
                if (!addedChannelCorrectly){
                    return;
                }
                interaction.channel.send(`Added channel ${classChannel} (${classChannel.id}) as a Homework channel`)
            }     
        }
        
        
        allChannelIDs = channelIDs.split(" ")  
        allChannelIDs.forEach(hwChannelID => {
            var hwChannel = interaction.channel.guild.channels.cache.get(hwChannelID); 
            validateChannel(hwChannel);  
        }) 
        const classChannel = interaction.channel.guild.channels.cache.get(allChannelIDs[0]);
        const sID = classChannel.guild.id;
        console.log(sID);
        
        console.log('INSERTING DATA INTO DATABASE')
        ClassDB.write(sID, roleID, channelIDs, classCode, classTitle, imageUrl, numberOfAssignments.toString())
        
		return interaction.followUp("You set " + classCode + " to be the class code for " + roleMention(roleID) + "\n The class title is: " + classTitle + "\nThe class image is: " + imageUrl)
	},
};