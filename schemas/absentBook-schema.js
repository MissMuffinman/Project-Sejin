const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}
const number = {
    type: Number,
    required: true,
    unique: true,
    validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
    }
}

const absentBookSchema = mongoose.Schema({
    _id: reqString,
    classCode: reqString,
    absentCount: number
})

module.exports = mongoose.model('absent-book', absentBookSchema)