const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Manager Sejin is online!');

    const activities = ['BE', 'BTS', 'BA memes' ];
    let i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`,
        { type:'STREAMING', url:'https://www.youtube.com/watch?v=-5q5mZbe3V8' }), 10000);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
    const command = args.shift();
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!' + command.name);
    }
});

client.login(token);
