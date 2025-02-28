---
title: "Deploying Next.JS on AWS with Lambda, S3 & CloudFront"
subtitle: ""
date: "2025-02-28"
previewImage: images/nextjs.png
---

## What is Next.js?

Next.js is a React framework for building web applications. It renders server-side by default but can also use static site generation (SSG) and API routes

## How can NextJS run inside a lambda?

The "native" way to run Next.js is to deploy it on the vercel hosting provider but by using the [AWS Lambda web adapter](https://github.com/awslabs/aws-lambda-web-adapter) it can also
be deployed in an AWS Lambda Function.

## What infrastructure is required?

### Lambda

This will act as the server

### S3

Static files will be stored as objects in S3 so that they are not served directly by the server

### Cloudfront

So that S3 objects are stored in regional edge caches all requests for static files will be made via the CloudFront CDN

## Deploying to AWS

The following steps will walk you through how to deploy a Next.js application to AWS using Lambda, S3 and CloudFront

## Create the Lambda Function

1. Create a lambda function named **aws-nextjs-lambda**, ensure it has a function url
2. Set the handler to **run.sh**
3. Add the following environment variables:

```yaml
AWS_LAMBDA_EXEC_WRAPPER: /opt/bootstrap
PORT: 8000
RUST_LOG: info
```

4. Add the AWS Lambda Web Adapter layer **arn:aws:lambda:eu-west-2:753240598075:layer:LambdaAdapterLayerX86:24**

## Create the S3 bucket

1. Create an S3 bucket, I have named it named **aws-nextjs-s3** but as bucket names must be globally unique you will have to choose your own name

2. Update the bucket policy, remember that the value **CLOUDFRONT_DISTRIBUTION_ARN** will have to be updated once the CloudFront distribution has been created

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Sid": "AllowCloudFrontServicePrincipalReadOnly",
    "Effect": "Allow",
    "Principal": {
      "Service": "cloudfront.amazonaws.com"
    },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::aws-nextjs-s3/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "CLOUDFRONT_DISTRIBUTION_ARN"
      }
    }
  }
}
```

## Create the CloudFront distribution

CloudFront is a CDN which we will use to serve all static content.

1. Create a distribution with the following settings:

- Origin domain: **aws-nextjs-s3** (the bucket we created earlier)
- Origin access control enabled
- Disable WAF

2. At this point the AWS console will prompt you to update the S3 bucket policy so that CloudFront can read from the bucket

3. Add an additional origin using the Lambda function url as the Origin Domain

4. Edit the default CloudFront Distribution behaviour to point to the Lambda origin that was created in the previous step

5. Add a CloudFront Distribution behaviour to route all requests for static files to the S3 bucket:

- Path pattern: **\_next/static/\*\***
- Origin: **aws-nextjs-s3.s3.eu-west-2.amazonaws.com**

## Create the Next.JS application

To create the Next.JS application run **npx create-next-app@latest**

Then we need to change the default settings in **next.config.ts**

```js
const nextConfig = {
  output: "standalone",
  assetPrefix: "DISTRIBUTION_DOMAIN_NAME",
  images: {
    unoptimized: true,
  },
};
```

**output: "standalone"** generates an output directory that can be deployed to AWS and is explained [here](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output), it excludes the **public** and **.next/static** directories as these will be deployed to the CloudFront distribution specified in the `assetPrefix` value.

**images -> unoptimized -> true** is also set as this is a Vercel feature.

## Deploy scripts

Next we need to create some scripts to bundle, deploy and run the application

In the root directory create **run.sh** which is the script that the Lambda will use to start the webserver.

```sh
#!/bin/bash

[ ! -d '/tmp/cache' ] && mkdir -p /tmp/cache

HOSTNAME=0.0.0.0 exec node server.js
```

Also in the root directory create **prepare-build.sh**

````sh
cp -r public/. .next/standalone/public
cp -r .next/static/. .next/standalone/.next/static
cp run.sh .next/standalone/run.sh```
````

Add the following scripts to **package.json**

```json
"build": "next build && sh ./prepare-build.sh",
"zip": "cd .next/standalone/ && zip -r app.zip . ",
"cp": "aws s3 cp ./.next/static s3://aws-nextjs-s3/_next/static --recursive"
```

## Build and deploy the Lambda

Run the following commands

1. npm run build
2. npm run zip
3. Upload the file **.next/standalone/app.zip** to the Lambda
4. npm run cp

## Viewing the application

Now the Next.JS application can be accessed via the CloudFront Distribution domain name; all assets in the directory **\_next/static/\*\*** will be cached in cloudfront and all server requests will be handled by the Lambda function.

(The code for this application is availble on GitHub)[https://github.com/LucasAmos/AWS/tree/master/aws-nextjs-lambda]
