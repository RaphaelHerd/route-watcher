'use strict';

const uuid = require('uuid');
const https = require('https');
const AWS = require('aws-sdk');
const util = require('util')

const TABLE_NAME = process.env.DYNAMODB_TABLE || "route-service-dev";
const debug = process.env.FIREBASE_ENABLE_DEBUG || "true";
const API_KEY = process.env.GOOGLE_API_KEY;
const urlPattern = process.env.MAPS_URL || "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=%s&origins=%s&departure_time=now&key=%s";
//var homeAddress="Weseler+Str.+81,+46499+Hamminkeln";
//var workAddress="Bayer+Business+Services+GmbH,+Geb%C3%A4ude+B151,+D%C3%BCsseldorfer+Stra%C3%9Fe,+Cologne"

const dynamoDb = new AWS.DynamoDB.DocumentClient();
writeTrace("Entrer create method");

module.exports.determineRoute = (event, context, callback) => {
  try {
      // check for input parameters
      const source = event.routeSource;
      const destination = event.routeDestination;

      // determine route info and store into dynamo db table
      writeTrace("Try get route information from : " + source+" to : " + destination);
      getRouteInformation(source, destination, insertIntoTable);
      
      writeTrace("Successfully inserted item into datebase");
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify("Successfully inserted data"),
      };
      writeTrace("Finish inserting items");
      callback(null, response);
  }
  catch(error) {
    // log error  
    writeLog(error);
    
    // return http 501 status code for internal error
    callback(null, {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Error inserted data.',
    });
  }
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

/**
 * Determins the route information between source and target location
 * @param {*} source 
 * @param {*} destination 
 * @param {*} callback 
 */
function getRouteInformation(source, destination, callback) {

    var url = util.format(urlPattern, source, destination, API_KEY);
    https.get(url, (res) => { 
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          // parse body json and callback db insertion function
          var data = JSON.parse(body);
          writeTrace("Got a response: " + body);
          callback(data);
      });
    }).on('error', (e) => {
      throw new Error(e.message);
    });
}

/**
 * callback for inserting data into table
 * @param {*} data 
 */
function insertIntoTable(data) {

    var date = new  Date();
    const currentDate = date.toLocaleString('de', {
      timeZone: 'Europe/Berlin'
    });
    
    const timestamp = date.getTime();
    writeTrace("date log : " + currentDate);
    
    // parse json file from google maps api
    var durationInTraffic = data.rows[0].elements[0].duration_in_traffic.value;
    var distance = data.rows[0].elements[0].distance.value;
    var duration = data.rows[0].elements[0].duration.value;
    var destinationAddress = data.destination_addresses[0];
    var sourceAddress= data.origin_addresses[0];

    var traffic = "low";
    // if 10% more time, moderate
    if(duration*1.10 < durationInTraffic) {
        traffic = "moderate"
    }
    // if > 25% more time, high
    if(duration*1.25 < durationInTraffic) {
      traffic = "high"
    }

    // create db item object
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: uuid.v1(),
        date: currentDate,
        duration: duration,
        duration_in_traffic: durationInTraffic,
        distance: distance,
        traffic: traffic,
        updatedAt: timestamp,
        source: sourceAddress,
        destination: destinationAddress
      },
    };

    writeTrace("Try insert into DB");
    // write the item into the database
    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        throw new Error(error.message);
      }      
    });
}