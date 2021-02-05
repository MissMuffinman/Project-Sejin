const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const messageChannelSchema = mongoose.Schema({
    _id: reqString, //bot channel id
    channelID: reqString, //message channel id
})

module.exports = mongoose.model('messageChannel-info', messageChannelSchema)