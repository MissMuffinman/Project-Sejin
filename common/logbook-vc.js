const LogMessage = require('./logbook-message');

module.exports = class VCLogBook extends LogMessage {
    constructor(messageChannel, classInfo, description) {
        super(messageChannel, classInfo, description);
        this.extra = '출석자 Attendees: ';
    }

    sendLogBookMessage(names, classSize) {
        this.sendFirstPartOfLogbookMessage();
        const list = this.mentionList(names);
        if (list.length > 0) {
            this.sendStudentsUsernamesByGroup(list, this.messageChannel, classSize);
        }
        this.messageChannel.send({ files: [this.classInfo.img] });
    }
};