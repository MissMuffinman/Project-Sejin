const LogMessage = require('./logbook-message')

module.exports = class HomeworkLogBook extends LogMessage {

    constructor(messageChannel, classInfo, description, hwNumbers){
        super(messageChannel, classInfo, description)
        this.hwNumbers = hwNumbers;
        this.extra = ""
    }

    sendLogBookMessage(names, classSize){

        this.sendFirstPartOfLogbookMessage()

        for (let i = 0; i < Object.keys(names).length; i++) {
            var key = Object.keys(names)[i]
            this.messageChannel.send(`Homework ${key}`);
            var list = this.mentionList(names[key]);
            this.sendStudentsUsernamesByGroup(list, this.messageChannel, classSize)
        }
        messageChannel.send({ files: [this.classInfo.img] })
    }
}