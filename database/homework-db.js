const AWS = require("aws-sdk");

function read(channelID, startDate, endDate) {
  var path = require("path");
  var pathToJson = path.resolve(__dirname, "../aws_config.json");
  AWS.config.loadFromPath(pathToJson);

  const ddb = new AWS.DynamoDB();

  var studentsIDs = [];

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

  var students = [];
  ddb.query(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data.Items);
      data.Items.forEach(function (element) {
        studentsIDs.push(element.studentID.S);
        //console.log(element.studentID.S);
      });
    }
  });
  return studentsIDs;
}

function write(studentID, channelID, timestamp) {
  var path = require("path");
  var pathToJson = path.resolve(__dirname, "../aws_config.json");
  AWS.config.loadFromPath(pathToJson);

  const ddb = new AWS.DynamoDB();

  var params = {
    TableName: "BA-Homework",
    Item: {
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
}

module.exports.read = read;
module.exports.write = write;
