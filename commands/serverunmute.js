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
        var members = message.guild.members.cache;
        var user = message.client.users.cache.find(u => u.tag === username);
        if(!user){
            return message.reply(`User ${username} not found`);
        }
        userID = user.id;
        var member = members.get(userID);
        console.log(member.voice.serverMute); 
        if (!member.voice.channelID){
            return message.reply(`User <@${userID}> is not connected in a voice channel.`)
        }
        if (member.voice.serverMute){
            member.voice.serverMute = false;
            member.edit({mute: false});
            member.edit({serverMute: false});
            console.log(member.voice.serverMute);
            message.reply(`User <@${userID}> has been server unmuted.`)
        }
        else {
            message.reply(`User <@${userID}> wasn't server muted.`)
        }

        console.log(member.voice);
    }
}