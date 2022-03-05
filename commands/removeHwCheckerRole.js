const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('removehwcheckerrole')
		.setDescription('Remove a role for being a homework checker')
		.setDefaultPermission(false)
		.addRoleOption(option =>
            option.setName('role')
                .setDescription('The role that checks homework')
                .setRequired(true)),
		async execute(interaction) {
		const options = interaction.options
		const roleID = options.getRole('role').id;

		const emoji = interaction.guild.emojis.cache.find(emoji => emoji.name === "purple_check_mark"); // first, get the emoji
		emoji.roles.remove(roleID);
		interaction.reply(`You removed the role ${roleMention(roleID)} from being a homework checker.`)
	},
};