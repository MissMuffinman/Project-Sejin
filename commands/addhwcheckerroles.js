module.exports = {
    commands: 'addhwcheckerroles',
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
            //console.log(message.guild.roles.cache.get(roleIDs[0]).permissions.toArray());
            emoji.roles.add([roleIDs[0]]);
            message.channel.send(`You set the role <@&${roleIDs[0]}> to be a homework checker.`)
        }
        else {
            emoji.roles.add(roleIDs);
            message.channel.send(`You set the roles <@&${roleIDs.join('> <@&')}> to be homework checkers.`)
        }
    }
}