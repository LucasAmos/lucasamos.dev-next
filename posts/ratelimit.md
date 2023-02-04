---
title: Creating an API rate limiter using Next.js middleware
subtitle: "Protect your endpoints"
date: "2023-02-03"
previewImage: images/Nextjs.png
---

## Creating a rate limiter

I recently used the AWS Simple Email Service and Next.js API routes to add an [email contact form](https://www.lucasamos.dev/contact) to my website. I decided to add a rate limiter that would track the IP addresses of requests and protect the API endpoints from malicious bulk requests that could generate excessive AWS costs.

### Sending an email

The code for sending the email is straightforward and by locating it in the [pages/api](https://github.com/LucasAmos/lucasamos.dev-next/blob/master/pages/api/email.ts) directory it automatically becomes an api route. This alone is sufficient to send an email but as it stands the endpoint allows unlimited requests, this can be solved by implementing a rate limiting middleware.

```js
const client = new SESv2Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type EmailApiRequest = Override<NextApiRequest, { body: EmailRequestBody }>;

export type EmailRequestBody = {
  name: string;
  email: string;
  message: string;
};

export default async (req: EmailApiRequest, res: NextApiResponse): Promise<void> => {
  const { name, email, message } = req.body;

  const params: SendEmailCommandInput = {
    FromEmailAddress: process.env.EMAIL,
    Destination: {
      ToAddresses: [process.env.EMAIL],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "message from website",
        },
        Body: {
          Text: {
            Data: `\n
            Name: ${name} \n
            email: ${email} \n
            message: ${message}`,
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await client.send(command);
    res.status(200).json("success");
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify({ error: "Email was not sent" }));
  }
};
```

### Next.js middleware

The function **middleware** in [middleware.ts](https://github.com/LucasAmos/lucasamos.dev-next/blob/master/middleware.ts) intercepts every api request and allows the request to be rejected or redirected. Creating a function **rateLimit** that receives the origin ip address for each request allows logic to be implemented for rejecting the request with a **429** error if too many requests have occurred within the specified time period.

```js
export type MiddlewareRequest = Override<
  NextRequest,
  {
    ip: string,
    body: { nextUrl: { pathname: string } },
  }
>;

export async function middleware(request: MiddlewareRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname === "/api/email") {
    const allowRequest = await rateLimit(request.ip);

    if (allowRequest === false) {
      return new NextResponse(JSON.stringify({ success: false, message: "Rate limit exceeded" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}
```

### Sliding window algorithm

The algorithm that I decided to implement is the sliding window algorithm, this was chosen as it would allow me to easily limit each IP address to 5 requests per 24 hour period.

This advantage of this algorithm is that unlike other algorithms such as _fixed window_ it is unaffected by a surge in requests. The disadvantages are that a record must be written to the database for each request and each request will trigger the calculation of how many requests occurred in the previous 24 hours.

### Choosing the database

To implement rate limiting a database is needed to store request ip address and the time of the requests. A NoSQL database is ideal for this so I have used AWS DynamoDB, ordinarily an in-memory database such as redis would be used to reduce the request latency but DynamoDB is sufficient for my use case.

![dynamodb table structure ](/images/ratelimittable.png)

### Storing requests

Inserting an ip and array of request datetimes in the database is achieved using the **PutItemCommand** function of the AWS DynamoDB SDK

```js
export async function putRequests(
  ip: string,
  dates: Date[],
  client: DynamoDBClient
): Promise<PutItemCommandOutput> {
  const putItemParams: PutItemCommandInput = {
    TableName: "rate-limits",
    Item: { ip: { S: ip }, log: { S: JSON.stringify(dates) } },
  };
  return client.send(new PutItemCommand(putItemParams));
}
```

### Getting past requests

Retrieving the requests is slightly more complicated as the first request from any IP address will not have a corresponding entry in the database. This is solved by using the optional chaining operator to conditionally check if any requests have been returned, parsing the stringified date array if so and returning **null** if not.

```js
export async function getPastRequests(ip: string, client: DynamoDBClient): Promise<Date[] | null> {
  const getItemParams: GetItemCommandInput = {
    TableName: "rate-limits",
    Key: {
      ip: {
        S: ip,
      },
    },
  };

  const res = await client.send(new GetItemCommand(getItemParams));

  if (res?.Item?.requests?.S) {
    return JSON.parse(res.Item.log.S).map((date: string) => new Date(date));
  }
  return null;
}
```

### Filtering requests to those within the window period

To check if the request should be allowed we first need a function that will remove all dates within a given time period.

```js
export function filterDates(dates: Date[], startDate: Date): Date[] {
  return dates.filter((date) => {
    return date > startDate;
  });
}
```

### Rate limit code

Using the **putRequests**, **getPastRequests**, and **filterDates** functions the following code will return false if 5 or more requests have been made within the previous 24 hours. Using this in the middleware will allow requests to be rate limited.

```js
export async function rateLimit(ip: string): Promise<boolean> {
  const ddbClient = new DynamoDBClient({
    region: "eu-west-2",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const record = await getPastRequests(ip, ddbClient);

  if (record === null) {
    await putRequests(ip, [new Date()], ddbClient);
    return true;
  } else {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    const previousRequests = filterDates(record, yesterday);
    if (previousRequests.length < 5) {
      await putRequests(ip, previousRequests.concat([new Date()]), ddbClient);
      return true;
    } else {
      return false;
    }
  }
}
```

### IAM permissions

It is important to use the principle of least privilege when creating AWS IAM permissions. The following IAM policy contains only the required ses:SendEmail, dynamodb:PutItem and dynamodb:GetItem actions and limits them to specific resources.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SES",
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": ["arn:aws:ses:eu-west-2:000000000000:identity/emailaddress@lucasamos.dev"]
    },
    {
      "Sid": "dynamo",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:GetItem"],
      "Resource": ["arn:aws:dynamodb:eu-west-2:000000000000:table/rate-limit"]
    }
  ]
}
```

### Latency

As previously mentioned DynamoDB is not an in memory database, however a request response time of 520ms when sending an email request is acceptable.

![Network request time](/images/ratelimitspeed.png)
