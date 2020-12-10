# Serverless Project
A Serverless Deployment using AWS

## Installing/Prerequisites
If you don't have serverless you'll need to install it
```npm install -g serverless```

You will also need to link your AWS Provider with your Serverless Account
``` serverless config credentials -p aws --key <AWS_ACCESS_KEY_ID> --secret <AWS_SECRET_HERE> ```

Your IAM User's Access Key will need to have an AdministratorAccess Policy attached directly to the User
```{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}```

## Deployment
In the root of project you can run
```npm start```

This will run npm install && serverless deploy

##What it Does
npm start kicks off the Serverless deployment process. The Custom plugin is triggered after the deploy with the following code:
``` 'after:deploy:deploy': uploadFile.bind(null, serverless, options), ```

##Issues You May Encounter
S3 Buckets must be Globally Unique. I didn't find a great way to implement this so if you encounter an S3 related error you may need to change the bucket name in serverless.yml

##Cleanup
After manually purging all files from your S3 Bucket you should be able to run 
```serverless remove``` This will clean up your Cloud Formation Stack in AWS


