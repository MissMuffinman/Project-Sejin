const LogMessage = require('./logbook-message');

module.exports = class HomeworkLogBook extends LogMessage {
    constructor(messageChannel, classInfo, description, hwNumbers, hwDesc) {
        super(messageChannel, classInfo, description);
        this.hwNumbers = hwNumbers;
        this.hwDesc = hwDesc;
    }

    sendLogBookMessage(names) {
        this.sendFirstPartOfLogbookMessage();
        let fullMessage = '\n';

        for (let i = 0; i < Object.keys(names).length; i++) {
            const key = Object.keys(names)[i];
            const hwDesc = this.hwDesc.replace("'number'", key) + ' ';
            const list = this.mentionList(names[key]);
            fullMessage += hwDesc + list.join(' ') + ' \n\n';
        }

        if (fullMessage.length > 2000) {
            const messages = this.splitMessage(fullMessage, 2000);
            messages.forEach(message => this.messageChannel.send(message));
        } else {
            this.messageChannel.send(fullMessage);
        }

        this.messageChannel.send({ files: [this.classInfo.img] });
    }
};