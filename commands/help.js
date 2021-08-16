module.exports = {
    commands: 'help',
    callback: (message) => {
        if (message.author.bot) return
        message.channel.send(
`Hello my name is Sejin.
I see you need assistance. Here is step-by-step on how to use me.

1. setMessageChannel [channelID] [serverID (optional)]: This sets the message channel if Logbook doesn't reply try send the command again. If the message channel is in another server, add the server ID.

2. addcc [roleID] [VoiceChannelID/TextChannelID] [6 digital/letter class code ######] [Title (no spaces)] [number of Assignments, write 0 if the class doesn't have assignments] [img url] [serverID (optional)]: This command adds a class to the logbook.

3. log [Class code] [Description]: This command logs who attended class in the Voice channel that was set-up in addcc.

4. loghw [Class code] [Description] ([StartDayToCheck HH:MM LastDayToCheck HH:MM]): This command logs who submitted a homework correctly in a period of time in the text channel that was set-up in addcc.
Example: *loghw TEST01 Description goes here (2021/08/15 00:00 2021/08/21 11:00)

5. addhwcheckerrroles [roleID] [roleID] [roleID]: This command sets permissions for who can use the :purple_check_mark: emoji for checking homework. You add permissions to one or multiple roles.

6. removehwcheckerroles [roleID] [roleID] [roleID]: This command sets permissions for who can use the :purple_check_mark: emoji for checking homework. You remove permissions to one or multiple roles.

Useful commands:
findcc [RoleID]: This command gives you the class code.
help: Sends help.

How to check homework for logbook:
Once an assignment has been checked as correct, and the student should be added to logbook, first react with the assigment number, using for example :one: :two: :three:. Then, use the :purple_check_mark:  
\n`)
    }
}