---
title: Using EventBridge to unlock AWS event-driven architectures
subtitle: "Run code in response to events and decouple your applications"
date: "2020-09-19"
previewImage: images/jest.png
---

### Learn how to monitor AWS Events and write them to DynamoDB when a Lambda Function with the Python3.8 runtime is created.

&NewLine;

## Tell me more about AWS EventBridge

AWS EventBridge is a Serverless Event Bus that allows you to
create decoupled applications that respond to real-time events.
Using EventBridge you can ingest events from third-party sources
such as Zendesk or create rules that forward matching AWS events
to targets such as SNS or Lambda.

In this example we will create an EventBridge rule that is
triggered when a Lambda function is created, but only when the
Lambda's runtime is Python3.8. We will then store the event
details in a DynamoDB table. Follow the next steps to get
started.

## Enable CloudTrail logging

AWS EventBridge won't function without an active trail so
navigate to the CloudTrail console and make sure that logging is
enabled.

<img src="/images/eventbridge/cloudtrail.png" alt="Enabling cloudtrail"
style="max-width:600px"/>

## Create a target Lambda Function

When an Event occurs that has a matching EventBridge rule the
event is forwarded to one or more targets. A target can be many
services including SQS Queues, SNS topics and Lambda Functions.
In this example we will create a Lambda to process matched
events.

First create a DynamoDB table named
**eventbridge-notifier** with a Partition Key of
**id** We will use those to store data about matched
events.

Next create a NodeJS function with the following code. This will
record in the DynamoDB table the event id, eventTime,
eventSource, eventName, functionName, runtime and the event
itself.

Make sure to add the correct permissions to the Function so that
it can write to the DynamoDB table.

```javascript
const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-1" });
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

exports.handler = async (event) => {
  try {
    const { id, detail } = event;
    const { eventTime, eventSource, eventName, requestParameters } = detail;
    const { functionName, runtime } = requestParameters;

    const params = {
      TableName: "eventbridge-notifier",
      Item: {
        id: id,
        time: eventTime,
        eventSource,
        eventName,
        functionName,
        runtime,
        event,
      },
    };

    await docClient.put(params).promise();
    return "success";
  } catch (e) {
    return {
      statusCode: e.statusCode,
      body: e.message,
    };
  }
};
```

## Create an EventBridge Rule

The next step is to create an EventBridge rule for the event
that we want to match. Visit the EventBridge console and click{" "}
<b>create rule</b>. Here we have the option to choose from
pre-defined patterns. As these are not provided for every
service we will create our own rule. This will match a Lambda
CreateFunction event but only when the Function's runtime is
Python3.8

<img src="/images/eventbridge/rule.png" alt="Create an eventbridge rule"
style="max-width:700px"/>

<br>

Copy the below JSON into the Event Pattern

```javascript
{
  "detail": {
    "eventName": [
      "CreateFunction20150331"
    ],
    "requestParameters": {
      "runtime": [
        "python3.8"
      ]
    }
  },
  "source": [
    "aws.lambda"
  ]
}
```

<br>

Finally we must choose what to do when an event matching the
specified pattern occurs, we will choose **Lambda Function**
as the target and select the Function that we created earlier.

<img src="/images/eventbridge/selecttarget.png" alt="select rule target"
style="max-width:600px"/>

## Test the EventBridge rule by creating a Python3.8 Lambda

Now we can test that the EventBridge rule is functioning
correctly by creating a new Lambda Function with the Python3.8
runtime.

![python 3.8 lambda](/images/eventbridge/testfunction.png)

## Check the DynamoDB table

We can see that that the EventBridge rule has been triggered and
the event has been recorded in the DynamoDB table.

![DynamoDB event](/images/eventbridge/dynamoevent.png)

## Create a Java Lambda

If we create a Lambda that does not use the Python3.8 runtime we
can see that the event is not recorded in the DynamoDB table.

![Java lambda](/images/eventbridge/javafunction.png)

## What else can I use EventBridge for?

In this example we've set up a rule that matches an event that
originates from an AWS service. We've triggered a Function to
record the event in a DynamoDB table when a Python3.8 Lambda
Function is created. However EventBridge can also connect to
third party services such as Zendesk, Datadog, or Pagerduty.

There are however many use cases where monitoring the creation
of AWS services would be useful. Using
[Service Control Policies](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) it is possible to restrict the resources that a user can create.
However an EventBridge rule such as the one that we have created
could instead be used to log the creation of certain events. If
this backend functionality were combined with a front-end web
app it would create a powerful way for an organisation to easily
monitor the state of its AWS resources.

EventBridge Rules can also be created to notify users of adverse
resource actions such as a failure in creating an EBS snapshot
or when EC2 maintenance downtime is scheduled to occur, allowing
an organisation to take a pro-active approach to managing its
AWS resources.
