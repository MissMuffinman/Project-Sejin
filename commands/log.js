const mongo = require('../mongo')
const classCodesSchema = require('../schemas/classcodes-schema')
const messageChannelSchema = require('../schemas/messageChannel-schema')

module.exports = {
    commands: 'log',
    callback:  async (message) => {
        if (message.author.bot) return
        ccache = {}
        const { content, channel, guild } = message
        let text = content
        const args = text.split(' ')
        if (args.length < 2) {
            return message.reply("Please insert the class code and description.")
        }
        
        args.shift()
        console.log(args[0])

        const ccid = args[0]
        const description = args.slice(1)
        const desc = description.join(' ')
        var date = new Date();
        var engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var korDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        var monNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December']
        var meridian;
        var cstDate = "";

        //DST fix
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

        classSize = getMapSize(names)
        console.log(classSize)
        console.log(names)
        list = mentionList(names)

        messageChannel = guild.channels.cache.get(cID);

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
    }
}

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
