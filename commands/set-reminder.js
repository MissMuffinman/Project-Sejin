const { DateTime } = require('luxon');

module.exports = {
    // Name of the command. To run this command you have to input !setReminder
    name: 'setReminder',
    description: 'Set up reminder',
    args: true,
    execute(message, args) {
        if (args.length < 3) {
            return message.reply('Please enter 1. channelID 2. Time for reminder 3. Reminder message');
        }

        const [channelId, rawDeadlineInput, rawReminderMessage] = args;

        const discordClient = message.client;
        const currentChannel = discordClient.channels.cache.get(message.channel.id);
        const targetChannel = discordClient.channels.cache.get(channelId);
        const deadlineInput = rawDeadlineInput.replace(/['"]+/g, '');
        const reminderMessage = rawReminderMessage.replace(/['"]+/g, '');

        const deadline = DateTime.fromSQL(deadlineInput, { zone: 'America/Chicago' });
        if (!deadline.isValid) {
            return message.reply('Invalid deadline provided. Please enter deadline in correct format. YYYY-MM-DD HH:MM');
        }

        const deadlineInUTC = deadline.toUTC();
        const currentTimeUTC = DateTime.utc();

        if (currentTimeUTC > deadlineInUTC) {
            return message.reply('Deadline is in past. Invalid datetime provided.');
        }

        //const thirtyMinsBeforeDeadlineUTC = deadlineInUTC.minus({ minutes: 30 });
        const oneHourBeforeDeadlineUTC = deadlineInUTC.minus({ hours: 1 });
        const oneHourBeforeDeadlineCST = oneHourBeforeDeadlineUTC.setZone('America/Chicago');

        //const oneDayBeforeDeadlineUTC = deadlineInUTC.minus({ days: 1 });
        //this.sendReminder(thirtyMinsBeforeDeadlineUTC, channel, reminderMessage);
        this.sendReminder(oneHourBeforeDeadlineUTC, targetChannel, reminderMessage);
        //this.sendReminder(oneDayBeforeDeadlineUTC, channel, reminderMessage);

        // TODO: Consolidate into single message

        const deadlineMessage = 'Deadline: ' + deadline.toSQLDate() + ' ' + deadline.hour + ':' + deadline.minute;
        const reminderHourBeforeMessage = 'Reminder set to one hour before deadline: ' + oneHourBeforeDeadlineCST.toSQLDate() + ' ' + oneHourBeforeDeadlineCST.hour + ':' + oneHourBeforeDeadlineCST.minute;
        const reminderPromise = 'I will send reminder ' + oneHourBeforeDeadlineCST.toRelative() + ' in channel : ' + targetChannel.name;
        const newLine = '\n';

        const fullMessage = deadlineMessage.concat(newLine, reminderHourBeforeMessage, newLine, reminderPromise);
        currentChannel.send(fullMessage);
    },
    
    sendReminder: function(timeBeforeDeadline, channel, reminderMessage){
        const currentTimeUTC = DateTime.utc();

        const delay = timeBeforeDeadline.toMillis() - currentTimeUTC.toMillis();
        // TODO: Maybe can use Duration
        if(delay > 0 ) {
            setTimeout(function () {channel.send(reminderMessage);}, delay, channel, reminderMessage);
        }
    }
};