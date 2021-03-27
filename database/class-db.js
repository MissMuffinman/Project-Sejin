const AWS = require("aws-sdk");

function read(classCode) {
  var path = require("path");
  var pathToJson = path.resolve(__dirname, "../aws_config.json");
  AWS.config.loadFromPath(pathToJson);

  const ddb = new AWS.DynamoDB();

  var params = {
    Key: {
        'classCode': {S: classCode}
      },
    TableName: "BA-Class",
    ProjectionExpression: 'ATTRIBUTE_NAME'
  };

  var classInfo;
  ddb.getItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data.Item);
      classInfo = data.Item;
    }
  });
  return classInfo;
}

module.exports.read = read;
