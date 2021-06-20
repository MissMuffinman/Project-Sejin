const AWS = require("aws-sdk");

async function read(id) {
    try {
        var path = require("path");
        var pathToJson = path.resolve(__dirname, "../aws_config.json");
        AWS.config.loadFromPath(pathToJson);
    
        const ddb = new AWS.DynamoDB();

        var params = {
          Key: {
            "id": {
              "S": id
            }
          }, 
          TableName: "BA-Message-Channel"
        };
        
        const result = await ddb.getItem(params).promise();
        return result.Item;
    
    } catch (error){
        console.log(error);
    }
}

async function write(id, channelID, guildID) {
    try {
      var path = require("path");
      var pathToJson = path.resolve(__dirname, "../aws_config.json");
      AWS.config.loadFromPath(pathToJson);

      const ddb = new AWS.DynamoDB();

      var params = {
          TableName: "BA-Message-Channel",
          Item:{
              id: {S: id},
              channelID: { S: channelID },
              guildID: { S: guildID}
          }
      };

      ddb.putItem(params, function (err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data);
          }
        })
    } catch(error){
      console.log(error);
    }
}

module.exports.write = write;
module.exports.read = read;