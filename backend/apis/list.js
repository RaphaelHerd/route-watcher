'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const TABLE_NAME = process.env.DYNAMODB_TABLE || "route-service-dev";
const debug = process.env.FIREBASE_ENABLE_DEBUG || "true";
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: TABLE_NAME
};

module.exports.listRoutes = (event, context, callback) => {
  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todos.',
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


// Now we will define our date comparison functions. These are callbacks
// that we will be providing to the array sort method below.
var date_sort_asc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

var date_sort_desc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};

var res = [
  {
    "date": "2019-4-12 20:16:36",
    "distance": 95878,
    "updatedAt": 1555092996173,
    "destination": "Weseler Str. 81, 46499 Hamminkeln, Germany",
    "source": "Düsseldorfer Str. 500, 51061 Köln, Germany",
    "duration_in_traffic": 3848,
    "id": "1bcd26e0-5d4f-11e9-b01c-4984ea0352e5",
    "duration": 4069,
    "traffic": "low"
  },
  {
    "date": "2019-4-12 20:16:51",
    "distance": 95878,
    "updatedAt": 1555093011548,
    "destination": "Weseler Str. 81, 46499 Hamminkeln, Germany",
    "source": "Düsseldorfer Str. 500, 51061 Köln, Germany",
    "duration_in_traffic": 3848,
    "id": "24f730d0-5d4f-11e9-b01c-4984ea0352e5",
    "duration": 4069,
    "traffic": "low"
  },
  {
    "date": "2019-4-12 20:15:55",
    "distance": 95878,
    "updatedAt": 1555092955990,
    "destination": "Weseler Str. 81, 46499 Hamminkeln, Germany",
    "source": "Düsseldorfer Str. 500, 51061 Köln, Germany",
    "duration_in_traffic": 3853,
    "id": "03de9870-5d4f-11e9-b01c-4984ea0352e5",
    "duration": 4069,
    "traffic": "low"
  },
  {
    "date": "2019-4-12 20:16:07",
    "distance": 95878,
    "updatedAt": 1555092967692,
    "destination": "Weseler Str. 81, 46499 Hamminkeln, Germany",
    "source": "Düsseldorfer Str. 500, 51061 Köln, Germany",
    "duration_in_traffic": 3848,
    "id": "0ad34bd0-5d4f-11e9-b01c-4984ea0352e5",
    "duration": 4069,
    "traffic": "low"
  }
];