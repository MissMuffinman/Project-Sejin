const AWS = require("aws-sdk");

async function read(id) {
    try {
        var path = require("path");
        var pathToJson = path.resolve(__dirname, "../aws_config.json");
        AWS.config.loadFromPath(pathToJson);
    
        const ddb = new AWS.DynamoDB();

        console.log(`its me the id ${id}`);
        var params = {
            ExpressionAttributeValues: {
                ":idNumber": { S: id },
            },
            KeyConditionExpression: "id = :idNumber",
            TableName: "BA-Message-Channel",
        };
        const result = await ddb.query(params).promise();
        return result.Item;
    } catch (error) {
        console.log(error);
    }
}

function write(id, channelID) {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    var params = {
        TableName: "BA-Message-Channel",
        Item:{
            id: {S: id},
            channelID: { S: channelID },
        }
    };

    ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      })
}

module.exports.write = write;
module.exports.read = read;