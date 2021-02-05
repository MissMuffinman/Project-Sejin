module.exports = {
    name: 'help',
    description: 'Command providing help instructions',
    args: false,
    execute(message) {
        message.channel.send('Hello my name is Sejin.\nI see you need assistance. Here is set-by-step on how to use me.\n\n1. setMessageChannel [channelID]: This sets the message channel if Logbook doesn\'t reply try send the command again.\n\n2. addcc [roleID] [VoiceChannelID] [6 digital/letter class code ######] [Title (no spaces)] [img url]: This command adds a class to the logbook.\n\n3. log [Class code] [Description]: This command logs who attended class in the Voice channel that was set-up in addcc.\n\nUseful commands:\nfindcc [RoleID]: This command gives you the class code.\nhelp: Sends help.\n');
    },
};