---
title: "Track application expenses using AWS Cost Explorer "
subtitle: "Improve efficiency and optimise your cloud spending"
date: "2024-06-25"
previewImage: images/aws.png
---

## What is cost explorer

According to the AWS documentation [Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) "is a tool that enables you to view and analyze your costs and usage." That pretty much says it all and by using the tool's built in filters and tags you can isolate costs for specific services and even for an entire application stack.

## Use cases

Insight into costs is essential for cost optimsation and is one of the [AWS Well Architected](https://aws.amazon.com/architecture/well-architected/) pillars. By identifying project and resource costs the source of high costs can be identified and optimised and teams can more easily be held responsibile for the running costs of their applications.

## Setting up user defined cost allocation tags

Before a cost report can be created for a group of resources, user defined cost allocation tags must first be set up in cost explorer. This involes two steps

1. At least one resource must have a [custom tag](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/custom-tags.html) applied. For this example I have two buckets

- **priceless-lucas**
- **priceless-lucas2**

To one the tag **Name=priceless** is applied and the other **Name=priceless2**

  <img src="/images/tag.png" width=400>

2. User-defined cost allocation tags must then be [activated](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/activating-tags.html) in cost explorer. Once this is done it may take a short time for the tags to become present in cost explorer.

  <img src="/images/tag2.png" width=900>

## Triggering S3 expenditure

To create a cost report we must first incur some costs, we will do this by making PUT requests to an S3 bucket. The AWS free tier is so generous that, under light usage it can be difficult to trigger an expense

Consider the S3 free tier for example:  
**5GB of Standard Storage**  
**20,000 Get Requests**  
**2,000 Put Requests**

To ensure that some costs are incurred, running the following script for each bucket will incur a few pence of charges.

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "eu-west-2" });

const body = "x".repeat(11024);

for (let index = 0; index < 3000; index++) {
  const params = {
    Body: body,
    Bucket: "BUCKET_NAME",
    Key: `key-${Date.now()}`
  };
  const command = new PutObjectCommand(params);
  await client.send(command);
  console.log(index);
}
```

## Waiting for the usage to appear in cost explorer

Usage data does not arrive in cost explorer immediately. The delay is not documented but in my experience it is between 24 and 36 hours.

## Viewing total usage

When the Billing and Cost Management service is first loaded, the cost and usage graph will have no bars. Select **usage** from the **Charge type** dropdown and select a date range. The total cost (excluding tax) of all usage will be displayed for the selected time period.

![Total usage for given time period](/images/costexplorer3.png)

## Using filters to create a report

To create a report for a specific tag choose the Tag key from the Tag menu. Once this is selected a _Name_ dropdown will appear where the tag value can be selected.

<img src="/images/tag4.png" width=300>
<img src="/images/tag3.png" width=300>

This will create a cost and usage report for the resources tagged **Name=priceless** i.e. the S3 bucket _priceless-lucas_. If we wanted to create a report for the second S3 bucket _priceless-lucas2_ we would change the tag value in the **name** dropdown menu.

![Priceless cost report](/images/priceless1.png)

## Conclusion

In this example the only resource in the report is S3 but many varying types of resources can be tagged with the same value allowing reports to be generated that encapsulate all of the resources used by a specific project.
