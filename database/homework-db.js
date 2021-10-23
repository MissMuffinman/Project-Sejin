const AWS = require("aws-sdk");

async function read(channelID, startDate, endDate, classCode) {
  try {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    //var studentsIDs = [];

    //console.log(`channelID: ${channelID}`);
    var params = {
      ExpressionAttributeValues: {
        ":s": { S: startDate },
        ":e": { S: endDate },
        ":classCode": { S: classCode },
      },
      KeyConditionExpression: "classCode = :classCode",
      FilterExpression: "#timestamp BETWEEN :s and :e",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      TableName: "BA-Homework",
    };

    const result = await ddb.query(params).promise();
    return result.Items;
  } catch (error) {
    console.log(error);
  }
}

//TODO: Modify this to async
async function write(messageID, studentID, channelID, timestamp, type, classCode) {
  try {
    var path = require("path");
    var result;
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    var params = {
      TableName: "BA-Homework",
      Item: {
        messageID: { S: messageID },
        studentID: { S: studentID },
        channelID: { S: channelID },
        timestamp: { S: timestamp },
        classCode: { S: classCode},
        type: { S: type},
      },
    };
    return new Promise(resolve => {
      ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
          result = false;
          resolve(result);
        } else {
          console.log("Success", data);
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
