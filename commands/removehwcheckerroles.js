module.exports = {
    commands: 'removehwcheckerroles',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 2) {
            return message.reply("Please insert the role ID.")
        }

        args.shift()
        roleIDs = args

        
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name === "purple_check_mark"); // first, get the emoji
        if (roleIDs.length == 1){
            //emoji.roles.remove([roleIDs[0]]);
            emoji.roles.remove([roleIDs[0]]);
            message.channel.send(`The role <@&${roleIDs[0]}> is no longer a homework checker.`)
        }
        else {
            //emoji.roles.remove(roleIDs);
            emoji.roles.remove(roleIDs);
            message.channel.send(`The roles <@&${roleIDs.join('> <@&')}> are no longer homework checkers.`)
        }
    }
}