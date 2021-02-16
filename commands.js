const mongo = require('./mongo')
const command = require('./command')
const classCodesSchema = require('./schemas/classcodes-schema')
const messageChannelSchema = require('./schemas/messageChannel-schema')
//const absentBookSchema = require('./schemas/absentBook-schema')
const { get } = require('mongoose')

module.exports = (client) => {
    const icache = {}
    const ncache = {}

    command(client, 'addcc', async message => {
        if (message.author.bot) return

        const { content } = message

        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 5) {
            return message.reply("Please insert the class ID, classroom ID, the class code, title, and image.")
        }

        args.shift()
        console.log(args[0])
        _id = args[0]
        classCode = args[2]
        title = args[3]
        image_url = [4]

        ncache[_id] = [classCode]

        await mongo().then(async (mongoose) => {
            console.log('INSERTING DATA INTO DATABASE')
            try {
                await classCodesSchema.findOneAndUpdate({
                    _id: args[0]
                }, {
                    _id: args[0],
                    channelID: args[1],
                    classCode: args[2],
                    title: args[3],
                    image_url: args[4]
                }, {
                    upsert: true
                })
            } finally {
                mongoose.connection.close()
            }
        })

        message.channel.send("You set " + args[2] + " to be the class code for <@&" + args[0] + ">\nThe class title is: " + args[3] + "\nThe class image is: " + args[4])
    })
    //findcc command
    command(client, 'findcc', async message => {
        if (message.author.bot) return

        const { content } = message
        let text = content
        const args = text.split(' ')

        console.log(text)

        if (args.length < 2) {
            return message.reply("Please input the role id.")
        }

        args.shift()
        console.log(args[0])
        id = args[0]
        let data = ncache[id]

        if (!data) {
            console.log('FETCHING FROM DATABASE')
            await mongo().then(async (mongoose) => {
                try {
                    const result = await classCodesSchema.findById(id)

                    ncache[id] = data = [result.classCode]
                } finally {
                    mongoose.connection.close()
                }

            })
        }

        const cc = data[0]
        message.channel.send("The class code is: " + cc)
    })

    //log command
    command(client, 'log', async message => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel } = message
        let text = content
        const args = text.split(' ').map(arg => arg.trim())

        args.shift()
        const argslist = argsMaptoList(args)
        console.log(args[0])

        if (argslist.length < 2) {
            return message.reply("Please insert the class code and description.")
        }

        const ccid = args[0]
        const description = args.slice(1)
        const desc = description.join(' ')
        //const currentDate = new Date().toLocaleDateString()
        var date = new Date();
        var engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var korDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        var monNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December']
        var meridian;
        var cstDate = "";
        var date = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours() - 6,
            date.getUTCMinutes())

        meridian = (date.getHours() < 12) ? "AM" : "PM";
        //CST date example: December 23, 2015 11:30 AM
        cstDate = months[date.getMonth()]
            + " "
            + date.getDate()
            + ", "
            + date.getFullYear()
            + " "
            + date.getHours()
            + ":"
            + date.getMinutes()
            + " "
            + meridian;

        console.log(cstDate)
        console.log(desc)

        var monthNum = monNum[date.getMonth()]
        var monthName = months[date.getMonth()]
        var engDay = engDays[date.getDay()]
        var korDay = korDays[date.getDay()]

        if (ccid.length < 7) {
            console.log('FETCHING FROM DATABASE')
            await mongo().then(async (mongoose) => {
                try {
                    const result = await classCodesSchema.findOne({ classCode: ccid })
                    ccache = [result._id, result.channelID, result.title, result.image_url]
                } finally {
                    mongoose.connection.close()
                }

            })
        }

        await mongo().then(async (mongoose) => {
            try {
                const output = await messageChannelSchema.findOne({ _id: channel.id })
                cIDcache = [output.channelID]
            } finally {
                mongoose.connection.close()
            }

        })

        console.log('DATA FETCHED')
        let riddata = ccache
        let ciddata = cIDcache
        const cID = ciddata[0]
        const assignedRole = riddata[0]
        const room = riddata[1]
        const title = riddata[2]
        const img = riddata[3]

        console.log(title, assignedRole, room, korDay, desc, img)

        names = message.guild.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id)
        //names = message.guild.channels.cache.get(room).members.map(m => m.user.id)

        classSize = getMapSize(names)
        console.log(classSize)
        console.log(names)
        list = mentionList(names)

        messageChannel = client.channels.cache.get(cID);

        messageChannel.send("LOGBOOK: " + title +
            "\n<@&" + assignedRole +
            ">\n" + engDay + ", " + date.getDate() + " " + monthName + " " + date.getFullYear() +
            "\n" + date.getFullYear() + "년 " + monthNum + "월 " + date.getDate() + "일 " + korDay +

            "\n\n" + desc + "\n출석자 Attendees: ")


        for (i = 0; i <= Math.ceil(classSize / 50); i++) {
            List = list.slice(i * 50, i * 50 + 50).join(' ')
            if (i < 1) {
                messageChannel.send(List)
            }
            else if (getMapSize(List) > 0) {
                messageChannel.send("cont.\n" + List)
            }
        }
        messageChannel.send({ files: [img] })

        //absentees list here
        //maplist = m.role - get(room) ???
        //for x of maplist ??
        // create a database log that finds id and updates the absents to ++
        //make a map who missed class with amount of absents next to their name
        //print list
    })

    command(client, 'setMessageChannel', async message => {
        if (message.author.bot) return
        const { content, channel } = message
        let text = content
        const args = text.split(' ').map(arg => arg.trim())
        cid = channel.id
        args.shift()
        const argslist = argsMaptoList(args)


        const chanID = args[0]
        console.log(chanID)

        if (argslist.length < 1) {
            return message.reply("Please insert the channel ID you wish to set the Message Channel to.")
        }

        let idata = icache[cid]


        console.log('FETCHING FROM DATABASE')

        await mongo().then(async (mongoose) => {
            try {
                const output = await messageChannelSchema.findOneAndUpdate({
                    _id: cid
                }, {
                    _id: cid,
                    channelID: chanID
                }, {
                    upsert: true
                })
                console.log(output.channelID)
                icache[cid] = idata = [output._id, output.channelID]
            } finally {
                mongoose.connection.close()
            }
        })

        message.channel.send("You set the message channel to be: " + chanID)
    })

    command(client, 'help', message => {
        if (message.author.bot) return
        message.channel.send("Hello my name is Sejin.\nI see you need assistance. Here is step-by-step on how to use me.\n\n1. setMessageChannel [channelID]: This sets the message channel if Logbook doesn't reply try send the command again.\n\n2. addcc [roleID] [VoiceChannelID] [6 digital/letter class code ######] [Title (no spaces)] [img url]: This command adds a class to the logbook.\n\n3. log [Class code] [Description]: This command logs who attended class in the Voice channel that was set-up in addcc.\n\nUseful commands:\nfindcc [RoleID]: This command gives you the class code.\nhelp: Sends help.\n")
    })

    function getMapSize(x) {
        var len = 0
        for (var count in x) {
            len++
        }

        return len
    }

    function mentionList(x) {
        let values = Array.from(x.values())
        for (var i = 0; i < values.length; i++) {
            values[i] = "<@" + values[i] + ">"

        }
        return values
    }

    function argsMaptoList(x) {
        let values = Array.from(x.values())

        return values
    }

}

