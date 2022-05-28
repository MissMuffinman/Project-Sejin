module.exports = class LogBookMessage {
    constructor(messageChannel, classInfo, description) {
        this.messageChannel = messageChannel;
        this.classInfo = classInfo;
        this.desc = description;
    }

    getDateMessage() {
        let date = new Date();
        const engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const korDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        const monNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // DST fix
        date = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours() - 5,
            date.getUTCMinutes());

        const meridian = (date.getHours() < 12) ? 'AM' : 'PM';
        // CST date example: December 23, 2015 11:30 AM
        const cstDate = months[date.getMonth()]
            + ' '
            + date.getDate()
            + ', '
            + date.getFullYear()
            + ' '
            + date.getHours()
            + ':'
            + date.getMinutes()
            + ' '
            + meridian;


        const monthNum = monNum[date.getMonth()];
        const monthName = months[date.getMonth()];
        const engDay = engDays[date.getDay()];
        const korDay = korDays[date.getDay()];
        const message =
            `${engDay}, ${date.getDate()} ${monthName} ${date.getFullYear()}\n${date.getFullYear()}년 ${monthNum}월 ${date.getDate()}일 ${korDay}`;

        return message;
    }

    mentionList(x) {
        const values = Array.from(x.values());
        for (let i = 0; i < values.length; i++) {
            values[i] = '<@' + values[i] + '>';

        }
        return values;
    }

    getMapSize(x) {
        let len = 0;
        for (const count in x) {
            len++;
        }

        return len;
    }

    splitMessage(str, max) {
        const suffix = ' cont.';
        const numberOfMessages = Math.ceil(str.length / max);
        const messages = [];
        let start = 0;
        for (let i = 0; i < numberOfMessages; i++) {
            let message;
            if (i === numberOfMessages - 1) {
                message = `${str.substr(start)}\n`;
            } else {
                const end = start + str.substr(start, max - suffix.length).lastIndexOf(' ');
                message = `${str.slice(start, end)}\n${suffix}`;
                start = end + 1;
            }
            messages.push(message);
        }
        return messages;
    }

    sendStudentsUsernamesByGroup(list, messageChannel, classSize) {
        for (let i = 0; i <= Math.ceil(classSize / 50); i++) {
            const List = list.slice(i * 50, i * 50 + 50).join(' ');
            if (i < 1) {
                messageChannel.send(List);
            } else if (this.getMapSize(List) > 0) {
                messageChannel.send('cont.\n' + List);
            }
        }
    }

    sendFirstPartOfLogbookMessage() {
        const dateMessage = this.getDateMessage();
        let tagRole = '';
        console.log(this.classInfo.assignedRole);
        if (this.messageChannel.guild.roles.cache.get(this.classInfo.assignedRole) !== undefined) {
            // let role = message.guild.roles.find(r => r.name === );
            tagRole = `<@&${this.classInfo.assignedRole}>`;
        }
        this.messageChannel.send(`LOGBOOK: ${this.classInfo.title}\n ${tagRole}\n${dateMessage}\n\n${this.desc}\n`);
    }
};