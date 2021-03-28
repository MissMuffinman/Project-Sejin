const AWS = require("aws-sdk");

async function read(classCode) {
  let result;
  try {
    var path = require("path");
    var pathToJson = path.resolve(__dirname, "../aws_config.json");
    AWS.config.loadFromPath(pathToJson);

    const ddb = new AWS.DynamoDB();

    console.log(classCode);

    var params = {
      Key: {
        "classCode": {
          "S": classCode
        }
      }, 
      TableName: "BA-Class"
    };
    
    result = await ddb.getItem(params).promise();
    //console.log(JSON.stringify(result));

  } catch (error){
    console.log(error);
  }
  return result.Item;
}

module.exports.read = read;
