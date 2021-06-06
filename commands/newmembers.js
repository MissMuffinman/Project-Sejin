module.exports = {
    commands: 'newmembers',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        //const message = await channel.messages.fetch(data.message_id);
        var members = message.guild.members.cache;

        for (const [member, memberInfo] of members.entries()) {
            if(memberInfo.user.bot){
                continue;
            }
            var dateMember = new Date(memberInfo.joinedAt);
            var DifferenceInDays = getDifference(dateMember);
            if (DifferenceInDays > 14) {
                channel.send(`<@${member}> joined on ${memberInfo.joinedAt} (${DifferenceInDays}) and is no longer a new member`);
                members.get(member).roles.remove(['841060380473950208']);
                console.log(memberInfo.joinedTimestamp);
                console.log(memberInfo.voice.serverMute);
            }
        }
    }
}

function getDifference(dateMember) {
    var today = new Date();

    // To calculate the time difference of two dates
    var DifferenceInTime = today.getTime() - dateMember.getTime();
        
    // To calculate the no. of days between two dates
    var DifferenceInDays = Math.ceil(DifferenceInTime / (1000 * 3600 * 24));
    return DifferenceInDays;
}