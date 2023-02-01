---
title: Creating an API rate limiter using Next.js
subtitle: "Protect your endpoints"
date: "2023-02-01"
previewImage: images/nextjs.png
---

### Next.js middleware

###

### IAM permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SES",
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": ["arn:aws:ses:eu-west-2:998009851182:identity/email@lucasamos.dev"]
    },
    {
      "Sid": "dynamo",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:GetItem"],
      "Resource": ["arn:aws:dynamodb:eu-west-2:998009851182:table/rate-limit"]
    }
  ]
}
```
