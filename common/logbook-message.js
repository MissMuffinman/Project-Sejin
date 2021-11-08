module.exports = class LogBookMessage {
    constructor(messageChannel, classInfo, description){
        this.messageChannel = messageChannel;
        this.classInfo = classInfo;
        this.desc = description;
    }

    getDateMessage() {
        var date = new Date();
        var engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        var korDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        var monNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

    splitMessage(str, max){
        const suffix = " cont."
        var numberOfMessages = Math.ceil(str.length / max);
        var messages = [];
        var start = 0;
        for (var i = 0; i < numberOfMessages; i++) {
            if (i == numberOfMessages - 1){
                var message = `${str.substr(start, str.substr(start, start + max).lastIndexOf(' '))}\n`;
            }
            else {
                var end = str.substr(start, start + max - suffix.length).lastIndexOf(' ');
                var message = `${str.substr(start, end)}\n${suffix}`;
                start = end + 1;
            }
            messages.push(message);
        }
        return messages;
    }

    sendStudentsUsernamesByGroup(list, messageChannel, classSize){
        for (var i = 0; i <= Math.ceil(classSize / 50); i++) {
            var List = list.slice(i * 50, i * 50 + 50).join(' ')
            if (i < 1) {
                messageChannel.send(List)
            }
            else if (this.getMapSize(List) > 0) {
                messageChannel.send("cont.\n" + List)
            }
        }
    }

    sendFirstPartOfLogbookMessage(){
        const dateMessage = this.getDateMessage();
        var tagRole = "";
        console.log(this.classInfo.assignedRole);
        if (this.messageChannel.guild.roles.cache.get(this.classInfo.assignedRole) != undefined ){
            //let role = message.guild.roles.find(r => r.name === );
            tagRole = `<@&${this.classInfo.assignedRole}>`
        }
        this.messageChannel.send(`LOGBOOK: ${this.classInfo.title}\n ${tagRole}\n${dateMessage}\n\n${this.desc}\n${this.extra}`);
    }

}