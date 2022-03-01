const DiscordUtil = require('../common/discordutil.js');
const { SlashCommandBuilder} = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removehwchannel')
		.setDescription('Remove a homework channel')
        .setDefaultPermission(false)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel')
                .setRequired(true)),
	async execute(interaction) {
        const options = interaction.options
        const channelID = options.getChannel('channel').id;

        console.log('SAVING NEW CHANNEL')
        var removedChannelCorrectly = DiscordUtil.removeHomeworkChannel(channelID, interaction)
        if (removedChannelCorrectly){
            return interaction.reply(`Removed channel <#${channelID}> (${channelID}) as a Homework channel`)
        }
        
		return interaction.reply("There was a problem removeing this channel to the class.")
	},
};