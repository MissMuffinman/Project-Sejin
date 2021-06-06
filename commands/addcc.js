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
        sID = message.guild.id;


        console.log('INSERTING DATA INTO DATABASE')
        ClassDB.write(sID, rID, cID, cc, classTitle, url)

        message.channel.send("You set " + cc + " to be the class code for <@&" + rID + ">\nThe class title is: " + classTitle + "\nThe class image is: " + url)
    }
}