const Discord = require('discord.js')
const client = new Discord.Client()

const fs = require('fs')
const path = require('path')

const config = require('./config.json')
const token = (config.token)

client.once('ready', async () => {
    console.log('LogBook is online!')
    client.user.setActivity('BE', { type: 'LISTENING' })

const baseFile = 'command-base.js'
  const commandBase = require(`./commands/${baseFile}`)

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        commandBase(client, option)
      }
    }
  }

  readCommands('commands')
})

client.on('error', console.error);

client.login(token)
