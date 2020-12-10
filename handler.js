'use strict';

const AWS = require('aws-sdk')
const s3 = new AWS.S3();
const bucket = process.env.bucketName

module.exports.uploadFile = async event => {

  const fileName = "test.txt"
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: "Test Message Here",
    ContentType: "text/html",
  }

  console.log(`Here's the fileName => ${fileName} and bucket => ${bucket}`)
  
  const response = await s3.upload(params).promise()

  if (response) {
    console.log(`Successfully uploaded file`)
    return {
      statusCode: 200,
      body: JSON.stringify('Successfully uploaded file'),
    }
  }

  else {
    console.log(`Failed uploading file`)
    return {
      statusCode: 500,
      body: JSON.stringify('Failed uploading file'),
    }
  }
};