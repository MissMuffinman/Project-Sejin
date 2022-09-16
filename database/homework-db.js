const AWS = require('aws-sdk');
const path = require('path');

const pathToJson = path.resolve(__dirname, '../aws_config.json');

async function read(channelID, startDate, endDate, classCode) {
    try {
        AWS.config.loadFromPath(pathToJson);
        const ddb = new AWS.DynamoDB();

        const params = {
            ExpressionAttributeValues: {
                ':s': { S: startDate },
                ':e': { S: endDate },
                ':classCode': { S: classCode }
            },
            KeyConditionExpression: 'classCode = :classCode',
            FilterExpression: '#timestamp BETWEEN :s and :e',
            ExpressionAttributeNames: {
                '#timestamp': 'timestamp'
            },
            TableName: 'BA-Homework'
        };

        console.log(`Retrieving Homework: classCode ${classCode}, startDate ${startDate}, endDate ${endDate}`);
        const result = await ddb.query(params).promise();
        return result.Items;
    } catch (error) {
        console.log(error);
    }
}

async function write(messageID, studentID, channelID, timestamp, type, classCode) {
    try {
        AWS.config.loadFromPath(pathToJson);
        const ddb = new AWS.DynamoDB();

        const params = {
            TableName: 'BA-Homework',
            Item: {
                messageID: { S: messageID },
                studentID: { S: studentID },
                channelID: { S: channelID },
                timestamp: { S: timestamp },
                classCode: { S: classCode },
                type: { S: type }
            }
        };

        console.log(`Adding Homework: messageID ${messageID}, studentID ${studentID}, channelID ${channelID}, timestamp${timestamp}, type${type}, classCode ${classCode}`);
        return ddb.putItem(params, (err, data) => {
            if (err) {
                console.log('Error', err);
                return false;
            } else {
                console.log('Success', data);
                return true;
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function remove(messageID, classCode) {
    try {
        AWS.config.loadFromPath(pathToJson);
        const ddb = new AWS.DynamoDB();

        const params = {
            TableName: 'BA-Homework',
            Key: {
                classCode: { S: classCode },
                messageID: { S: messageID }
            }
        };

        console.log(`Removing Homework: messageID ${messageID}, classCode ${classCode}`);
        return ddb.deleteItem(params, (err, data) => {
            if (err) {
                console.log('Error', err);
                return false;
            } else {
                console.log('Success', data);
                return true;
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.read = read;
module.exports.write = write;
module.exports.remove = remove;
