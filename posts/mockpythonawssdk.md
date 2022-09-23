---
title: "Mocking the AWS SDK with Python"
subtitle: "Never hit those API endpoints"
date: "2022-09-22"
previewImage: images/aws.png
---

Over the past few months I have been working extensively with [AWS QuickSight](https://aws.amazon.com/quicksight/) to create a multi-account data platform. Recently I needed to peform a task at the end of a glue workflow, this meant that I would need to write the code in Python and not my usual language of choice TypeScript. The script itself was simple enough but when it came to testing, [moto](https://github.com/spulec/moto) the library that I usually use didn't have an implementation for the API call that I needed. This article will explain how I used the AWS SDK's built in helper functions to mock the API calls.

QuickSight is a service that I don't use outside of work and one that comes with upfront subscription costs so for simplicity I will show how to mock S3 API calls.

### A function to check if bucket versioning is enabled

First we must write a function to that returns **True** if [bucket versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) is enabled and false if it is not.

S3 bucket versioning has three states:

1. Enabled
2. Suspended
3. None

The default state of a bucket is for versioning to be disabled, this means that a request to **get_bucket_versioning** for a bucket that has never had versioning enabled will not return a **Status** key on the response object. For this reason it is essential to access the **Status** value using **bucket.get("Status")** and not **bucket['Status']**. The former will return **None** if they key does not exist whereas the latter will throw a **KeyError**.

```python
import boto3

s3_client = boto3.client("s3")

def is_bucket_versioning_enabled(bucket_name, client=s3_client):
    bucket = client.get_bucket_versioning(Bucket=bucket_name)
    return True if bucket.get("Status") == "Enabled" else False
```

### Mocking boto3

The first step in creating the tests is to import the **is_bucket_versioning_enabled** function and set up the [botocore stubber](https://botocore.amazonaws.com/v1/documentation/api/latest/reference/stubber.html) that will be used to mock the s3 client.

```python
import botocore.session
from botocore.stub import ANY, Stubber, validate_parameters

from src.app import is_bucket_versioning_enabled


s3_client = botocore.session.get_session().create_client("s3")
stubber = Stubber(s3_client)
```

Once the client is instantiated the responses must be added. We will create three response objects, one for each of the posible versioning states explained above.

```python
get_bucket_versioning_enabled = {
    "ResponseMetadata": {
        "RequestId": "5NBVFJAFBY98N3G7",
        "HostId": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
        "HTTPStatusCode": 200,
        "HTTPHeaders": {
            "x-amz-id-2": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
            "x-amz-request-id": "5NBVFJAFBY98N3G7",
            "date": "Thu, 22 Sep 2022 11:52:24 GMT",
            "transfer-encoding": "chunked",
            "server": "AmazonS3",
        },
        "RetryAttempts": 1,
    },
    "Status": "Enabled",
}

get_bucket_versioning_disabled = {
    "ResponseMetadata": {
        "RequestId": "5NBVFJAFBY98N3G7",
        "HostId": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
        "HTTPStatusCode": 200,
        "HTTPHeaders": {
            "x-amz-id-2": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
            "x-amz-request-id": "5NBVFJAFBY98N3G7",
            "date": "Thu, 22 Sep 2022 11:52:24 GMT",
            "transfer-encoding": "chunked",
            "server": "AmazonS3",
        },
        "RetryAttempts": 1,
    }
}

get_bucket_versioning_suspended = {
    "ResponseMetadata": {
        "RequestId": "5NBVFJAFBY98N3G7",
        "HostId": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
        "HTTPStatusCode": 200,
        "HTTPHeaders": {
            "x-amz-id-2": "hdWaC6zq+64ZL4CFR1L4docIYSJK8og8dm0RsgPbqjulPVrmTT3jJSS/SEMA8OdIFqVVIfCdoi4=",
            "x-amz-request-id": "5NBVFJAFBY98N3G7",
            "date": "Thu, 22 Sep 2022 11:52:24 GMT",
            "transfer-encoding": "chunked",
            "server": "AmazonS3",
        },
        "RetryAttempts": 1,
    },
    "Status": "Suspended",
}
```

The botocore docs state that:

**This class will allow you to stub out requests so you don't have to hit an endpoint to write tests. Responses are returned first in, first out. If operations are called out of order, or are called with no remaining queued responses, an error will be raised.**

This means that we need to be careful of the order in which we add the responses to the stubber and the order in which we write our tests.

**stubber.add_response** accepts three arguments:

1. The API call to be mocked
2. The response object
3. A parameter validation object.

```python
stubber.add_response(
    "get_bucket_versioning", get_bucket_versioning_enabled, {"Bucket": ANY}
)
stubber.add_response(
    "get_bucket_versioning", get_bucket_versioning_disabled, {"Bucket": ANY}
)

stubber.add_response(
    "get_bucket_versioning", get_bucket_versioning_suspended, {"Bucket": ANY}
)

stubber.activate()
```

### Writing the tests

Now the tests can be written to handle the three possible bucket versioning states. Remember to structure the tests to account for the order in which the responses were added to the stubber.

```python
def test_is_bucket_versioning_enabled_true():
    with stubber:
        res = is_bucket_versioning_enabled(bucket_name="test-bucket", client=s3_client)
    assert res == True


def test_is_bucket_versioning_enabled_false():
    with stubber:
        res = is_bucket_versioning_enabled(bucket_name="test-bucket", client=s3_client)

    assert res == False


def test_is_bucket_versioning_enabled_suspended():
    with stubber:
        res = is_bucket_versioning_enabled(bucket_name="test-bucket", client=s3_client)

    assert res == False
```

As always the code for this post is available on [GitHub](https://github.com/LucasAmos/AWS/tree/master/python_aws_mocking)

If you want to learn how to mock AWS API calls for the Node SDK read my popular post on how to [easily mock the AWS SDK using jest](/articles/jestmocking)
