'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const s3 = new AWS.S3();
const to = require('await-to-js').default;
const dynamodb = new AWS.DynamoDB();

const triggerActions = async (serverless, options) => {
  // chaining async functions
  try {
    const uploadLambda = require('../functions/uploader')
    const bucket = serverless.service.serverless.variables.service.custom.myS3Bucket
    const tableName = serverless.service.serverless.variables.service.custom.myDynamoTable

    const [uploadErr, uploadResult] = await to (uploadLambda.uploadFile(bucket))
  
    if (uploadResult) {
      console.log(JSON.stringify(uploadResult))
      const fileName = JSON.parse(uploadResult.fileName)
      let params = {
        Bucket: bucket,
        Key: fileName
      }
      const [errS3, resultS3] = await to (s3.getObject(params).promise())

      if (resultS3) {
        const fileContent = resultS3.Body.toString('utf-8')
        console.log(`Here are the contents of the file that we'll be uploading to DynamoDB: ${fileContent}`)

        params = {
          Item: {
            "upload": {
              S: fileContent
             }
           }, 
           ReturnConsumedCapacity: "TOTAL", 
           TableName: tableName
        } 

        const [errDynamo, resultDynamo] = await to (dynamodb.putItem(params).promise())

        if (resultDynamo) {
          console.log(resultDynamo)
        }
        
        else if (errDynamo) {
          console.log(JSON.stringify(errDynamo))
        }

        else {
          console.log(`Unexpected error while inserting ${fileContent} into Dynamo Table: ${tableName}`)
        }
      }

      else if (errS3) {
        console.log(errS3)
      }

      else {
        console.log(`Unexpected error while getting ${fileName} from ${bucket}`)
      }
    }

    else {
      console.log(uploadErr)
    }
  }
  catch (err) {
    console.log(`Received Error: ${err}`)
  }
}

class MyCustomPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      "copy-content": {
        usage: 'Uploads file to S3, GETs object you uploaded from S3 and extracts file content, uploads content to DynamoDB Table',
        lifecycleEvents: ['triggerActions'],
      },
    };
    this.hooks = {
      // 'after:deploy:deploy': uploadFile.bind(null, serverless, options),
      'copy-content:triggerActions': triggerActions.bind(null, serverless, options),
    };
  }
}

module.exports = MyCustomPlugin;
