module.exports = class LogBookMessage {
    constructor(messageChannel, assignedRole, room, title, description, img, type, alternativeRole){
        this.messageChannel = messageChannel;
        this.assignedRole = assignedRole;
        this.room = room;
        this.title = title;
        this.desc = description;
        this.img = img;
        this.type = type
        this.alternativeRole = alternativeRole
        this.extra = ""
        if (type == "vc") {
            this.extra = "출석자 Attendees: "
        }
    }

    getDateMessage() {
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
            date.getUTCHours() - 5,
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


        var monthNum = monNum[date.getMonth()]
        var monthName = months[date.getMonth()]
        var engDay = engDays[date.getDay()]
        var korDay = korDays[date.getDay()]
        var message = 
        `${engDay}, ${date.getDate()} ${monthName} ${date.getFullYear()}\n${date.getFullYear()}년 ${monthNum}월 ${date.getDate()}일 ${korDay}`

        return message;
    }

    mentionList(x) {
        let values = Array.from(x.values())
        for (var i = 0; i < values.length; i++) {
            values[i] = "<@" + values[i] + ">"
    
        }
        return values
    }
    
    getMapSize(x) {
        var len = 0
        for (var count in x) {
            len++
        }
    
        return len
    }

    sendLogBookMessage(names, classSize){
        const dateMessage = this.getDateMessage();
        var tagRole = "";
        if (this.messageChannel.guild.roles.cache.get(this.assignedRole) != undefined ){
            //let role = message.guild.roles.find(r => r.name === );
            tagRole = `<@&${this.assignedRole}>`
        }
        else {
            tagRole = `<@&${this.alternativeRole}>`
        }4
        this.messageChannel.send(`LOGBOOK: ${this.title}\n ${tagRole}\n${dateMessage}\n\n${this.desc}\n${this.extra}`);
        var list = this.mentionList(names);

        for (var i = 0; i <= Math.ceil(classSize / 50); i++) {
            var List = list.slice(i * 50, i * 50 + 50).join(' ')
            if (i < 1) {
                messageChannel.send(List)
            }
            else if (this.getMapSize(List) > 0) {
                messageChannel.send("cont.\n" + List)
            }
        }
        messageChannel.send({ files: [this.img] })
    }

}