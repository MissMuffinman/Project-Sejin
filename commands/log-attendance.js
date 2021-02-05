const mongo = require('../mongo.js');
const ClassCode = require('../schemas/classcodes-schema');
const MessageChannel = require('../schemas/messageChannel-schema');
let ccache = {};
let cIDcache = {};

// TODO: Need to fix the map/array/attributes assignment in the logic
module.exports = {
	name: 'logAttendance',
	description: 'Log attendance',
	args: true,
	execute(message, args) {

		if (args.length < 2) {
			return message.reply('Please insert the class code and description.');
		}

		const ccid = args[0];
		const description = args.slice(1);
		const desc = description.join(' ');
		// const currentDate = new Date().toLocaleDateString()

		const engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const korDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
		const monNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
		const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
		let cstDate = '';
		const date = new Date(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours() - 6,
			date.getUTCMinutes());

		const meridian = (date.getHours() < 12) ? 'AM' : 'PM';
		// CST date example: December 23, 2015 11:30 AM
		cstDate = months[date.getMonth()]
            + ' '
            + date.getDate()
            + ', '
            + date.getFullYear()
            + ' '
            + date.getHours()
            + ':'
            + date.getMinutes()
            + ' '
            + meridian;

		console.log(cstDate);
		console.log(desc);

		const monthNum = monNum[date.getMonth()];
		const monthName = months[date.getMonth()];
		const engDay = engDays[date.getDay()];
		const korDay = korDays[date.getDay()];

		mongo.connectToDB();

		if (ccid.length < 7) {
			console.log('FETCHING FROM DATABASE');

			ClassCode.findOne({ classCode: ccid })
				.then(output => {
					ccache = [output._id, output.channelID, output.title, output.image_url];
				});
		}


		MessageChannel.findOne({ _id: ccid.id })
			.then(output => {
				cIDcache = [output.channelID];
			});

		console.log('DATA FETCHED');
		const riddata = ccache;
		const ciddata = cIDcache;
		const cID = ciddata[0];
		const assignedRole = riddata[0];
		const room = riddata[1];
		const title = riddata[2];
		const img = riddata[3];

		console.log(title, assignedRole, room, korDay, desc, img);

		names = message.guild.channels.cache.get(room).members.filter(m => m.roles.cache.get(assignedRole)).map(m => m.user.id);


		classSize = getMapSize(names);
		console.log(classSize);
		console.log(names);
		list = mentionList(names);

		messageChannel = client.channels.cache.get(cID);

		if (classSize <= 50) {
			smallList = list.slice(0, 49).join(' ');
			messageChannel.send('LOGBOOK: ' + title +
                '\n<@&' + assignedRole +
                '>\n' + engDay + ', ' + date.getDate() + ' ' + monthName + ' ' + date.getFullYear() +
                '\n' + date.getFullYear() + '년 ' + monthNum + '월 ' + date.getDate() + '일 ' + korDay +

                '\n\n' + desc +
                '\n출석자 Attendees: ' + smallList, { files: [img] });

		}
		else if (classSize > 50 && classSize <= 100) {
			smallList = list.slice(0, 49).join(' ');
			mediumList = list.slice(50, 99).join(' ');

			messageChannel.send('LOGBOOK: ' + title +
                '\n<@&' + assignedRole +
                '>\n' + engDay + ', ' + date.getDate() + ' ' + monthName + ' ' + date.getFullYear() +
                '\n' + date.getFullYear() + '년 ' + monthNum + '월 ' + date.getDate() + '일 ' + korDay +

                '\n\n' + desc +
                '\n출석자 Attendees: ' +
                smallList);
			messageChannel.send('cont.\n' + mediumList, { files: [img] });

		}
		else if (classSize > 100 && classSize <= 150) {
			smallList = list.slice(0, 49).join(' ');
			mediumList = list.slice(50, 99).join(' ');
			largeList = list.slice(100, 149).join(' ');

			messageChannel.send('LOGBOOK: ' + title +
                '\n<@&' + assignedRole +
                '>\n' + engDay + ', ' + date.getDate() + ' ' + monthName + ' ' + date.getFullYear() +
                '\n' + date.getFullYear() + '년 ' + monthNum + '월 ' + date.getDate() + '일 ' + korDay +

                '\n\n' + desc +
                '\n출석자 Attendees: ' +
                smallList);
			messageChannel.send('cont.\n' + mediumList);
			messageChannel.send('cont.\n' + largeList, { files: [img] });

		}
		else if (classSize > 150 && classSize <= 200) {
			smallList = list.slice(0, 49).join(' ');
			mediumList = list.slice(50, 99).join(' ');
			largeList = list.slice(100, 149).join(' ');
			xlList = list.slice(150, 199).join(' ');

			messageChannel.send('LOGBOOK: ' + title +
                '\n<@&' + assignedRole +
                '>\n' + engDay + ', ' + date.getDate() + ' ' + monthName + ' ' + date.getFullYear() +
                '\n' + date.getFullYear() + '년 ' + monthNum + '월 ' + date.getDate() + '일 ' + korDay +

                '\n\n' + desc +
                '\n출석자 Attendees: ' +
                smallList);
			messageChannel.send('cont.\n' + mediumList);
			messageChannel.send('cont.\n' + largeList);
			messageChannel.send('cont.\n' + xlList, { files: [img] });

		}
		else {
			message.channel.send('Class is over 200 students... please don\'t make me log them all. :5hobiface: ');
		}

		// absentees list here
		// maplist = m.role - get(room) ???
		// for x of maplist ??
		// create a database log that finds id and updates the absents to ++
		// make a list who missed class with amount of absents next to their name
		// print list
	},

	getMapSize: function(x) {
		let len = 0;
		for (const count in x) {
			len++;
		}

		return len;
	},

	mentionList: function(x) {
		const values = Array.from(x.values());
		for (let i = 0; i < values.length; i++) {
			values[i] = '<@' + values[i] + '>';

		}
		return values;
	},

	argsMaptoList: function(x) {
		const values = Array.from(x.values());

		return values;
	},
};