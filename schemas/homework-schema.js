const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const homeworkSchema = mongoose.Schema({
    _id: reqString,
    channelID: reqString,
    studentID: reqString,
    timestamp: reqString,
})

module.exports = mongoose.model('homework', homeworkSchema)