const LogMessage = require('./logbook-message')

module.exports = class HomeworkLogBook extends LogMessage {

    constructor(messageChannel, classInfo, description, hwNumbers, hwDesc){
        super(messageChannel, classInfo, description)
        this.hwNumbers = hwNumbers;
        console.log(hwDesc);
        this.hwDesc = hwDesc;
        console.log(this.hwDesc);
    }

    sendLogBookMessage(names){

        this.sendFirstPartOfLogbookMessage()
        var fullMessage = "\n"

        for (let i = 0; i < Object.keys(names).length; i++) {
            var key = Object.keys(names)[i]
            var hwDesc = this.hwDesc.replace('"number"', i + 1) + " ";
            var list = this.mentionList(names[key]);
            fullMessage += hwDesc + list.join(" ") + " \n\n";
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