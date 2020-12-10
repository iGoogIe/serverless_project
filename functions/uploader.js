'use strict';
const AWS = require('aws-sdk')
const s3 = new AWS.S3();
const to = require('await-to-js').default;

module.exports.uploadFile = async bucket => {
  const fileName = "test.txt"
  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: "Test Message Here",
    ContentType: "text/html",
  }

  console.log(`Here's the fileName => ${fileName} and bucket => ${bucket}`)
  console.log("Attempting to Upload to S3")

  let [err, result] = await to (s3.upload(params).promise())

  if (result) {
      console.log(`Successfully uploaded file`)
      return {
        statusCode: 200,
        body: JSON.stringify('Successfully uploaded file'),
        fileName: JSON.stringify(fileName)
      }
  }

  else if (err) {
      console.log(`Failed uploading file ${err}`)
      return {
        statusCode: 500,
        body: JSON.stringify('Failed uploading file'),
        fileName: JSON.stringify(fileName)
      }
  }
  };