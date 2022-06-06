---
title: A cloudwatch log insights query to retrieve bucket access history
subtitle: "Query your logs for auditing and informational purposes"
date: "2022-06-07"
previewImage: images/aws.png
---

I recently had the need to secure some S3 buckets so that I could restrict access to only the required principals. I was pretty confident that I knew which principals I need to add to the bucket policy but I wanted to make sure that I didn't omit any roles and break our CI/CD pipeline.

As I had both CloudTrail and [Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html) enabled I knew that the information I needed would be in the logs.

After a little bit of experimentation I came up with with this this [Cloudwatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html) query.

```sql
fields @message
| filter eventCategory == "Data"
| filter eventSource == 's3.amazonaws.com'
| filter requestParameters.bucketName == 'lucas-test-bucket'
| stats count(*) as count by eventSource, eventName, requestParameters.bucketName, userIdentity.sessionContext.sessionIssuer.userName
```

### The query explained

The key parts of the query are as follows

1. **filter eventCategory == "Data"** This filters out all non data events such as _management events_
2. **filter eventSource == 's3.amazonaws.com'** I'm only concerned with S3 events
3. **filter requestParameters.bucketName == 'lucas-test-bucket'** This narrows the results down to a single bucket and probably makes the previous filter clause redundant
4. **stats count(\*) as count by** This works similarly to DISTINCT in an SQL query and groups the results into unique rows that makes the results much more concise
5. **userIdentity.sessionContext.sessionIssuer.userName** This is the name of the role that accessed the bucket and is what I need to add to the bucket policy

As you can see, the following results provide all of the information I need to identify not only which principals accessed the bucket but which operations they performed, allowing me to follow the [principle of least privilege](https://docs.aws.amazon.com/lambda/latest/operatorguide/least-privilege.html) when creating the bucket policy.

![Cloudwatch log insights](/images/cloudwatchloginsights.png)
