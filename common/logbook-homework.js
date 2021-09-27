const LogMessage = require('./logbook-message')

module.exports = class HomeworkLogBook extends LogMessage {

    constructor(messageChannel, classInfo, description, hwNumbers){
        super(messageChannel, classInfo, description)
        this.hwNumbers = hwNumbers;
        this.extra = ""
    }

    sendLogBookMessage(names, classSize){

        this.sendFirstPartOfLogbookMessage()
        var fullMessage = "\n"

        for (let i = 0; i < Object.keys(names).length; i++) {
            var key = Object.keys(names)[i]
            var hwDesc = `Assignment ${key}: `;
            var list = this.mentionList(names[key]);
            fullMessage += hwDesc + list + " \n";
        }
        if (fullMessage.length > 2000) {
            var messages = this.splitMessage(fullMessage, 2000);
            messages.forEach(message => this.messageChannel.send(message));
        }
        else {
            this.messageChannel.send(fullMessage);
        }
        messageChannel.send({ files: [this.classInfo.img] })
    }
}