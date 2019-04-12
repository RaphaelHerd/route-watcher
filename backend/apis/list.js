'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const TABLE_NAME = process.env.DYNAMODB_TABLE || "route-service-dev";
const debug = process.env.ENABLE_DEBUG || "true";
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: TABLE_NAME
};

module.exports.listRoutes = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      writeLog(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch route information.',
      });
      return;
    }

    writeTrace(JSON.stringify(result.Items));

    // var data = JSON.parse(result.Items);
    var items = result.Items.sort(function(a, b) { return a.updatedAt < b.updatedAt ? 1 : -1; }).slice(0, 200);

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
    callback(null, response);
  });
};

/**
 * Writes to console
 * @param {lognessage} message 
 */
function writeLog(message) {
  console.log("LOG : " + message);
}
/**
 * Writes to console if debug is true
 * @param {lognessage} message 
 */

 /**
  * 
  * @param {*} message 
  */
function writeTrace(message) {
  if(debug && debug.includes("true")) {
    console.log("TRACE : " + message);
  }
}