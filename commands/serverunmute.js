const DiscordUtil = require('../common/discordutil.js');

module.exports = {
    commands: 'unmute',
    callback:  async (message) => {

        if (message.author.bot) return
        const { content, channel } = message
        let text = content
        const args = text.split(' ')

        if (args.length < 1) {
            return message.reply("Please add username")
        }

        args.shift()
        const username = args[0];
        var member = DiscordUtil.getMemberByUsername(message, username);
        if (!member.voice.channelID){
            return message.reply(`User <@${userID}> is not connected in a voice channel.`)
        }
        if (member.voice.serverMute){
            member.voice.serverMute = false;
            member.edit({mute: false});
            member.edit({serverMute: false});
            message.reply(`User <@${userID}> has been server unmuted.`)
        }
        else {
            message.reply(`User <@${userID}> wasn't server muted.`)
        }

    }
}