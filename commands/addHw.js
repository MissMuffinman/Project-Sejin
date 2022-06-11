const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('add homework')
    .setType(3)
    .setDefaultPermission(false),
  async execute(interaction) {
    const messageId = interaction.targetId;
    const options = [];

    for (let i = 0; i < 15; i++) {
      const option = {
        label: `Assignment ${i + 1}`,
        value: `${i + 1}`
      };
      options.push(option);
    }

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(`addhw_${messageId}`)
                .setPlaceholder('Select the assignment number')
                .addOptions(options)
        );

    interaction.followUp({ content: ' ', components: [row] });
  }
};
