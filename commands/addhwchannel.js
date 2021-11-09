const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addhwchannel')
		.setDescription('Add a homework channel to a class')
        .addStringOption(option =>
            option.setName('class_code')
                .setDescription('The class code for the class')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel')
                .setRequired(true)),
	async execute(interaction) {
        const options = interaction.options
        const channelID = options.getChannel('channel').id;
        const classCode = options.getString('class_code')

        console.log('SAVING NEW CHANNEL')
        var addedChannelCorrectly = DiscordUtil.addHomeworkChannel(channelID, interaction, classCode)
        if (addedChannelCorrectly){
            return interaction.reply(`Added channel <#${channelID}> (${channelID}) as a Homework channel`)
        }
        
		return interaction.reply("There was a problem adding this channel to the class.")
	},
};