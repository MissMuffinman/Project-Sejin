
module.exports = class HomeworkDB {
    read(channelID, startDate, endDate) {

        var path = require('path');
        var pathToJson = path.resolve(__dirname, '../../aws_config.json');
        AWS.config.loadFromPath(pathToJson);

        const ddb = new AWS.DynamoDB();

        var params = {
            ExpressionAttributeValues: {
              ':s': {S: startDate},
              ':e' : {S: endDate},
              ':class' : {S: channelID}
            },
            KeyConditionExpression: 'channelID = :class',
            ProjectionExpression: 'studentID',
            FilterExpression: 'timestamp BETWEEN :s and :e',
            TableName: 'BA-Homework'
          };
          
          ddb.query(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              //console.log("Success", data.Items);
              data.Items.forEach(function(element, index, array) {
                console.log(element.studentID.S + " (" + element.classID.S + ")");
              });
            }
          });
    }
  
    write(studentID, channelID, timestamp) {
        var path = require('path');
        var pathToJson = path.resolve(__dirname, '../../aws_config.json');
        AWS.config.loadFromPath(pathToJson);

        const ddb = new AWS.DynamoDB();

        var params = {
            TableName: 'BA-Homework',
            Item: {
              'studentID' : {S: studentID},
              'channelID' : {S: channelID},
              'timestamp' : {S: timestamp}
            }
          };

        ddb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
        });
    }
  };