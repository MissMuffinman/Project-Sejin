const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const classCodeSchema = mongoose.Schema({
	_id: reqString,
	channelID: reqString,
	classCode: reqString,
	title: reqString,
	image_url: reqString,
});

module.exports = mongoose.model('class-info', classCodeSchema);