---
title: "Reducing Secrets Manager costs via caching"
subtitle: "Only make API calls when Lambda cold starts or scales out"
date: "2020-10-09"
previewImage: images/secretsmanager.png
---

#### Secrets Manager costs $0.05 for every 10,000 API calls; that's cheap but costs can mount quickly when using AWS Lambda. Minimise your expenditure by caching your secrets.

&NewLine;

### What is Secrets Manager and why would I use it?

AWS [Secrets manager](https://aws.amazon.com/secrets-manager/) is a service that allows you to manage, rotate and retrieve credentials such as API tokens, database credentials and OAuth tokens. Secrets Manager has built-in integration with RDS, Redshift, and DocumentDB. It allows fine grained access policies to be implemented so that you can control access and even has built in auditing and so you can see when a key was rotated or deleted.

### If Secrets Manager is so great then why do I need to use caching?

Secrets Manager massively simplifies the management of credentials but if an API call must be made every time a Lambda is invoked latency will be added to your application. Add to this the costs for making requests to the Secrets Manager API and it's clear that caching the API response is something we should employ. In fact it's such a useful pattern that AWS has created a
[Java caching library](https://aws.amazon.com/blogs/security/use-aws-secrets-manager-client-side-caching-libraries-to-improve-the-availability-and-latency-of-using-your-secrets/). Unfortunately there is no library for Node or Python so we will have to create our own

### Creating a secret

Before we can implement our own caching solution we first need to create a secret. Visit Secrets Manager in the AWS console and create a secret. Keep note of its name and the region that it has been created in as we will need these later.

![Creating a new secret](/images/secrets/createsecret.png)

### Creating our own Lambda bootstrap code

Before every Lambda invocation we will call a bootstrap function to perform the following actions.
Check if the secret is stored in the Lambda's environment variables.
If the secret is not present, make an API call to Secrets Manager and store the result in an environment variable.

As environment variables are persisted between Lambda invocations this process will ensure that API calls to Secrets Manager are only made when a Lambda cold starts or is recycled.

The bootstrap code below functions in the following way:

- Line 5: The secret is fetched from the environment variables. If the secret is not cached this will be undefined otherwise it will be the cached secret.
- Line 7: If secret evaluates to true then it is returned.
- Line 12: This code is only reached if the secret was not cached and makes an API call to Secrets Manager. The **getSecretValue** API call requires a **SecretId** parameter which is the name of the secret that we created earlier and which is stored in an environment variable. Once the secret has been returned we destructure the **SecretString** value and return it.
- Line 17: Finally we call the **getSecret** function inside the **bootstrap** function and store the result in the **STORED_SECRET** environment variable.
- Lines 8 and 13 will print to the console and allow us to see when the secret is fetched from the cache and when it is fetched from Secrets Manager.

```javascript
const AWS = require("aws-sdk");
const client = new AWS.SecretsManager({ region: "eu-west-1" });

async function getSecret() {
  const secret = process.env["STORED_SECRET"];

  if (secret) {
    console.log("*** SECRET WAS IN THE CACHE");
    return secret;
  }

  const { SecretString } = await client
    .getSecretValue({ SecretId: process.env.SECRET_ID })
    .promise();
  console.log("*** SECRET WAS FETCHED FROM SECRETS MANAGER");
  return SecretString;
}

async function bootstrap() {
  const secret = await getSecret();
  process.env.STORED_SECRET = secret;
}

module.exports = { bootstrap };
```

<br>

#### Now we can test our bootstrapping code by invoking it in our Lambda function

```javascript
const { bootstrap } = require("./bootstrap/bootstrap");

exports.handler = async function handler(event) {
  await bootstrap();

  try {
    return process.env.STORED_SECRET;
  } catch (error) {
    throw error;
  }
};
```

<br>

We can see that the first time the Lambda Function is invoked the secret is fetched from Secrets manager

![](/images/secrets/secretfetch1.png)

<br>

For the subsequent invocations the secret is fetched from the cache and will continue to be fetched from the cache until the Function cold starts due to recycling or scale out.

![](/images/secrets/secretfetch2.png)

You can find the code used in this example on my [GitHub repository](https://github.com/LucasAmos/AWS/tree/master/SecretsManager)
