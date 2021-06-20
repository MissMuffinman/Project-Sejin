const ClassDB = require('../database/class-db')


module.exports = {
    commands: 'addcc',
    callback:  async (message) => {

        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 5) {
            return message.reply("Please insert the class ID, classroom ID, the class code, title, and image.")
        }

        args.shift()
        rID = args[0]
        cID = args[1]
        cc = args[2]
        classTitle = args[3]
        url = args[4]
        var alternativeRoleID = "";
        var sID;
        console.log(args.length);

        if (args.length > 5) {
            alternativeRoleID = args[5]
        }
        if (args.length > 6) {
            sID = args[6]
        }

        if (!sID){
            sID = message.guild.id;
        }

        console.log('INSERTING DATA INTO DATABASE')
        var status = ClassDB.write(sID, rID, cID, cc, classTitle, url, alternativeRoleID)

        console.log(status);

        if (!status) {
            return message.channel.send("There was a problem adding the class to the database")
        }
        message.channel.send("You set " + cc + " to be the class code for <@&" + rID + ">\nThe class title is: " + classTitle + "\nThe class image is: " + url)
    }
}