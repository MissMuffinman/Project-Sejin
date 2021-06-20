module.exports = {
    commands: 'help',
    callback: (message) => {
        if (message.author.bot) return
        message.channel.send(
`Hello my name is Sejin.
I see you need assistance. Here is step-by-step on how to use me.

1. setMessageChannel [channelID]: This sets the message channel if Logbook doesn't reply try send the command again.

2. addcc [roleID] [VoiceChannelID] [6 digital/letter class code ######] [Title (no spaces)] [img url] [alternativeRoleID (optional)] [serverID (optional)]: This command adds a class to the logbook.

3. log [Class code] [Description]: This command logs who attended class in the Voice channel that was set-up in addcc.

Useful commands:
findcc [RoleID]: This command gives you the class code.
help: Sends help.\n`)
    }
}