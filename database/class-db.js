const AWS = require("aws-sdk");
const { Message } = require("discord.js");

async function read(classCode) {
  try {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    //console.log(classCode);
    var params = {
      Key: {
        "classCode": {
          "S": classCode
        }
      }, 
      TableName: "BA-Class"
    };
    
    const result = await ddb.getItem(params).promise();
    //console.log(JSON.stringify(result));
    return result.Item;

  } catch (error){
    console.log(error);
  }
  //return result.Item;
}

async function write(roleID, channelID, classCode, title, image_url) {
  try {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    var params = {
        TableName: "BA-Class",
        Item:{
            classCode: {S: classCode},
            roleID: {S: roleID},
            channelID: { S: channelID },
            title: {S: title},
            image_url: {S: image_url},
        }
    };

    ddb.putItem(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      })
  } catch (error) {
    console.log(error);
  }
}

async function getClassCodeByRoleID(roleID) {
  try{
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    //console.log(classCode);
    var params = {
      TableName: "BA-Class",
      IndexName: 'RoleIDIndex',
      KeyConditionExpression: 'roleID = :role_id',
      ExpressionAttributeValues: { ':role_id': { 'S': roleID } } 
    };
  
    const result = await ddb.query(params).promise();
    //console.log(JSON.stringify(result));
    return result.Items[0];

  } catch (error) {
    console.log(error);
  }
//return result.Item;
} 

module.exports.read = read;
module.exports.write = write;
module.exports.getClassCodeByRoleID = getClassCodeByRoleID;
