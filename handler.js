'use strict';
var AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

module.exports.hello = async(event) => {
    console.log("event", event)
    if (event.operation === "POST") {
        const params = {
            Item: {
                "SongId": {
                    N: event.songId
                },
                "SongTitle": {
                    S: event.songTitle
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: "Songs"
        };
        try {
            const dbResponse = await dynamodb.putItem(params).promise()
            if (dbResponse) {
                const response = {
                    statusCode: 200,
                    body: "Song Inserted Successfully."
                };
                return response;
            }
        }
        catch (e) {
            console.log(e)
            const response = {
                statusCode: 400,
                body: JSON.stringify(e),
            };
            return response;
        }
    }
    else if (event.operation === "GET") {
        var params = {
            TableName: "Songs"
        };
        try {
            const dbResponse = await dynamodb.scan(params).promise()
            if (dbResponse) {
                console.log(dbResponse)
                const response = {
                    statusCode: 200,
                    body:
                        dbResponse.Items.length > 0 ?
                            dbResponse.Items.map(item => {
                                return {
                                    SongId: item.SongId.N,
                                    SongTitle: item.SongTitle.S
                                }
                            })
                            : [],
                };
                return response;
            }
        }
        catch (e) {
            console.log(e)
            const response = {
                statusCode: 400,
                body: JSON.stringify(e),
            };
            return response;
        }
    }

};


//================================================

//API GATEWAY INTEGRATION REQUEST AND RESPONSE

// GET

// Integration request
// {
//     "operation" : "$context.httpMethod"
// }

// Integration response
// {
//     "Items" : $input.json('$.body')
// }
    

// POST

//Integration request
// {
//     "operation" : "$context.httpMethod",
//     "songId" : $input.json('$.songId'),
//     "songTitle" : $input.json('$.songTitle')
// }

//Integration response
// {
//     "response" : $input.json('$.body')
// }
    

