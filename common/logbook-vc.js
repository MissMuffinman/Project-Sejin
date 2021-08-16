const LogMessage = require('./logbook-message')

module.exports = class VCLogBook extends LogMessage {

    constructor(messageChannel, classInfo, description){
        super(messageChannel, classInfo, description)
        this.extra = "출석자 Attendees: "
    }

    sendLogBookMessage(names, classSize){

        this.sendFirstPartOfLogbookMessage()
        var list = this.mentionList(names);

        this.sendStudentsUsernamesByGroup(list, this.messageChannel, classSize)

        messageChannel.send({ files: [this.classInfo.img] })

    }


}