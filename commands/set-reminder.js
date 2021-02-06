module.exports = {
    name: 'setReminder',
    description: 'Set up reminder',
    args: true,
    execute(message, args) {
        if (args.length < 3) {
            return message.reply('Please enter 1. channelID 2. Time for reminder 3. Reminder message');
        }

        const [channelId, deadline, reminderMessage] = args;

        const discordClient = message.client;
        const channel = discordClient.channels.cache.get(channelId);

        /**
         * 1. Convert deadline from CST to UTC
         * 2. Validate deadline is valid (in future) by comparing with current time
         * 3. Use https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args to setTimeout for future reminders.
         *  a. One for 1 day before deadline
         *  b. One for 3 hour before deadline
         *  c. One for 30 mins before deadline
         */

        const timeRemaining = Date.parse(deadline) - Date.parse(new Date());

        channel.send(reminderMessage + deadline);
    },
};