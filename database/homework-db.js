const AWS = require('aws-sdk');
const path = require('path');

async function read(channelID, startDate, endDate, classCode) {
    try {
        const pathToJson = path.resolve(__dirname, '../aws_config.json');
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

        const result = await ddb.query(params).promise();
        return result.Items;
    } catch (error) {
        console.log(error);
    }
}

// TODO: Modify this to async
async function write(messageID, studentID, channelID, timestamp, type, classCode) {
    try {
        let result;
        const pathToJson = path.resolve(__dirname, '../aws_config.json');
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
        return new Promise(resolve => {
            ddb.putItem(params, (err, data) => {
                if (err) {
                    console.log('Error', err);
                    result = false;
                    resolve(result);
                } else {
                    console.log('Success', data);
                    result = true;
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

async function remove(messageID, classCode) {
    try {
        let result;
        const pathToJson = path.resolve(__dirname, '../aws_config.json');
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
        return new Promise(resolve => {
            ddb.deleteItem(params, (err, data) => {
                if (err) {
                    console.log('Error', err);
                    result = false;
                    resolve(result);
                } else {
                    console.log('Success', data);
                    result = true;
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.read = read;
module.exports.write = write;
module.exports.remove = remove;
