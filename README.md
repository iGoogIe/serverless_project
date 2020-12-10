# Serverless Project
A Serverless Deployment using AWS

## Installing/Prerequisites
If you don't have serverless you'll need to install it

```npm install -g serverless```

You will also need to link your AWS Provider with your Serverless Account

``` serverless config credentials -p aws --key <AWS_ACCESS_KEY_ID> --secret <AWS_SECRET_HERE> ```

Your IAM User's Access Key will need to have an AdministratorAccess Policy attached directly to the User

```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

If you have the AWS CLI installed you may want to run

```aws configure```

This will configure AWS to run locally on your PC with your Access Credentials

## Deployment
In the root of project you can run

```npm start```

This will run npm install and serverless deploy

If you want to try running the plugin by itself you'll need to make a code change in .serverless_plugins/plugin.js

Change

```'after:deploy:deploy': uploadFile.bind(null, serverless, options),```

to the commented out line below it

```'copy-content:triggerActions': triggerActions.bind(null, serverless, options),```

This will ensure your plugin runs via the cli with the command:
```serverless copy-content```

## What it Does
npm start kicks off the Serverless deployment process. The Custom plugin is triggered after the deploy with the following code:

``` 'after:deploy:deploy': uploadFile.bind(null, serverless, options), ```

## Known Limitations
I had trouble triggering the lambda from serverless.yml. As a work around, I ensure it creates the lambda, then I use the custom plugin I wrote to trigger a local script in functions/uploader.js .

## Issues You May Encounter
S3 Buckets must be Globally Unique. I didn't find a great way to implement this so if you encounter an S3 related error you may need to change the bucket name in serverless.yml

## Cleanup
After manually purging all files from your S3 Bucket you should be able to run 

```serverless remove``` 

This will clean up your Cloud Formation Stack in AWS


