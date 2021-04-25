const AWS = require("aws-sdk");

async function read(channelID, startDate, endDate) {
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
        ":class": { S: channelID },
      },
      KeyConditionExpression: "channelID = :class",
      ProjectionExpression: "studentID",
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
  /*
  ddb.query(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data.Items);
      data.Items.forEach(function (element) {
        studentsIDs.push(element.studentID.S);
        console.log(element.studentID.S);
      });
      return studentsIDs;
    }
  });
  return studentsIDs;
  */
}

//TODO: Modify this to async
async function write(messsageID, studentID, channelID, timestamp) {
  try {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    var params = {
      TableName: "BA-Homework",
      Item: {
        messsageID: { S: messsageID },
        studentID: { S: studentID },
        channelID: { S: channelID },
        timestamp: { S: timestamp },
      },
    };

    ddb.putItem(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports.read = read;
module.exports.write = write;
