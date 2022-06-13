const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const hwChannels = require('../hwchannels.json');
const HomeworkDB = require('../database/homework-db');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('remove homework')
        .setType(3)
        .setDefaultPermission(false),
    async execute(interaction) {
        const messageId = interaction.targetId;
        const channelId = interaction.channelId;
        const guildId = interaction.guildId;
        const guild = interaction.client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(channelId);
        const classCode = hwChannels.ids[channelId];

        channel.messages.fetch(messageId).then((message) => {
            message.reactions.removeAll();
        }).catch((error) => {
            console.log(error);
        });

        await HomeworkDB.remove(messageId, classCode);

        return interaction.followUp({ content: `The homework with messageId ${messageId} has been removed 👍`, ephemeral: true });
    }
};