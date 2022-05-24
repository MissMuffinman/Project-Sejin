const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addhwcheckerrole')
		.setDescription('Add a role for being a homework checker')
		.setDefaultPermission(false)
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('The role that checks homework')
				.setRequired(true)),
	async execute(interaction) {
		const options = interaction.options;
		const roleID = options.getRole('role').id;

		// first, get the emoji
		const emoji = interaction.guild.emojis.cache.find(e => e.name === 'purple_check_mark');

		await emoji.roles.add([roleID]).then(()=>{
			console.log(emoji.roles);
			interaction.reply(`You set the role ${roleMention(roleID)} to be a homework checker.`);
		});
	}
};