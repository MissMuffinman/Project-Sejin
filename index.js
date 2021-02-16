const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const mongo = require('./mongo')
const commands = require('./commands')

const prefix = (config.prefix)

client.once('ready', async () => {
    console.log('LogBook is online!')

    commands(client) 
    
    let activities = [`BE`, `BTS`, `BA memes`],i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ %  activities.length]}`,  
                    {type:"STREAMING",url:"https://www.youtube.com/watch?v=-5q5mZbe3V8"  }), 10000)       
});

client.login(config.token)
