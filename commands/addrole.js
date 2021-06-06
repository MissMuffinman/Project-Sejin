const DiscordUtil = require('../common/discordutil.js');
//const csv = require('csv-parser');

module.exports = {
    commands: 'addrole',
    callback:  async (message) => {
        //if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 2) {
            return message.reply("Please insert the role id.")
        }
        if (message.attachments.size == 0 && args.length != 3) {
            return message.reply("Please attach a csv file.")
        }

        args.shift();
        console.log(args[0]);
        const roleID = args[0];        
        var attachmentURL;
        if (args.length > 1) {
            attachmentURL = args[1];       
        }
        else {
            const attachment = message.attachments.values().next().value;
            attachmentURL = attachment.url;
        }

        DiscordUtil.openFileAndDo(attachmentURL, function(member){ member.roles.add([roleID]); }, message);
    }
}
