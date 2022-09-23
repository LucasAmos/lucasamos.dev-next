---
title: "Easily mock the AWS SDK using jest"
subtitle: "Create resilient and repeatable unit tests by replacing the AWS SDK with your own implementation"
date: "2020-11-23"
previewImage: images/terraform.png
---

## What is mocking and why should we use it?

When testing code that makes use of the AWS SDK you are guaranteed to run into
issues right away. Take for example a function that calls the S3 API to list all of
the files that have been uploaded to a bucket in the last hour and returns the
filenames in a custom format. If we write tests that actually call the API, the
function under test is going to constantly return different responses making it
untestable. Furthermore, as the S3 API is outside of our control we aren't really
concerned with testing its functionality, what we really want to test is the code we
have written to make use of the API response.

Mocking is the solution to this problem, by replacing or <i>mocking</i> the AWS S3
SDK we can replace the API calls with our own implementation, for example, returning
a list of objects or returning an empty response so that we can test how our code
behaves whatever response that API returns. By mocking the AWS SDK we will be able
to write strong and repeatable tests.

In this blog post I will show you how to mock the AWS SecretsManager SDK so that you
can return a correctly formatted reponse and test your function without having to
actually interact with any AWS services. This pattern can be used to mock any AWS
service.

## Creating the function that we want to test

First we need to create the function that we want to test in **src/index.ts**.
That's right, I've started using
[TypeScript](https://www.typescriptlang.org/) in all of my new JavaScript
projects, if you're not familiar with TypeScript it is simply JavaScript with types and
you should definitely check it out. This requires a little bit of babel and jest setup;
which you can find on my
[GitHub](https://github.com/LucasAmos/AWS/tree/master/mockingwithjest)

The code we will test is pretty straightforward and fetches two secrets from AWS
[SecretsManager](https://aws.amazon.com/secrets-manager/), destructuring the responses and returning the secrets.

```javascript
import AWS from "aws-sdk";

AWS.config.update({ region: process.env.AWS_REGION });
const SM = new AWS.SecretsManager();

export default async function handler(): Promise<string> {
  const { SecretString } = await SM.getSecretValue({SecretId: "secret1"}).promise();
  const { SecretString: SecretString2 } = await SM.getSecretValue({SecretId: "secret2"}).promise();

  return \`\${SecretString} and \${SecretString2}\`;
}
```

## Mocking the AWS SDK

Since we want to ensure that no API calls are ever made to AWS Secrets Manager we can
mock the entire AWS SDK using **jest.mock("aws-sdk")** but if we want to take
our testing to the next level we need to implement our own mock functions for the AWS
SDK calls. We can do this by creating a test file in **tests/index.test.js**

The AWS SDK is simply a JavaScript Object so we can construct our own replacement,
mirroring the structure of the SDK so that our code still functions correctly. Using the
code below we can create our own implementation of the **getSecretValue**
function, we can even inspect the parameters and return different responses depending on
the SecretID, though in practice this should not be necessary. While our implementation
can be written using simple object notation, such as for the
**config.update()** function, creating functions using **jest.fn()** allows to do some pretty powerful stuff such as [spying](https://jestjs.io/docs/en/jest-object#jestspyonobject-methodname) on the function to see how many times it was called and the parameters that it was called
with.

An important thing to note is that calls to jest.mock() are hoisted to the top of the
file so it's not possible to first define a variable and then use it in our mock
implementation. We can get around this my making sure to prepend our mock function
variable name with **mock** which will prevent it from being hoisted i.e.
**mockgetSecretValue**, you can read more about jest's hoisting
[here](https://jestjs.io/docs/en/es6-class-mocks#calling-jestmockdocsenjest-objectjestmockmodulename-factory-options-with-the-module-factory-parameter)

```javascript
import AWS from "aws-sdk";
import handler from "../src/index";

const mockgetSecretValue = jest.fn((SecretId) => {
  switch (SecretId) {
    case "secret1":
      return {
        SecretString: "secret-1-value",
      };
    case "secret2":
      return {
        SecretString: "secret-2-value",
      };
    default:
      throw Error("secret not found");
  }
});

jest.mock("aws-sdk", () => {
  return {
    config: {
      update() {
        return {};
      },
    },
    SecretsManager: jest.fn(() => {
      return {
        getSecretValue: jest.fn(({ SecretId }) => {
          return {
            promise: () => mockgetSecretValue(SecretId),
          };
        }),
      };
    }),
  };
});
```

## Writing the test

From the code that we have written in **src/index.ts** and the mock functions
in **tests/index.test.js** we can expect our handler function to exhibit 3
behaviours that we can test.

1. The function should return the two secret values i.e.
   **"secret-1-value and secret-2-value"**
2. **mockgetSecretValue()** should be called twice
3. The call to construct the SecretsManger **new AWS.SecretsManager()** should
   be called only once

As we constructed our mock using **jest.fn()** we have the ability to spy on
**new AWS.SecretsManager()** and **mockgetSecretValue()**. We could
even utilise jest's [mockImplementationOnce](https://jestjs.io/docs/en/mock-function-api#mockfnmockimplementationoncefn) to return different responses each time the mocked function is invoked. We would
implement that with **const mockgetSecretValue = jest.fn().mockImplementationOnce(()
{"=>"} {"{...implementation here}"})**

```javascript
describe("When the handler is invoked with an event", () => {
  test("the correct response is returned", async () => {
    const spy = jest.spyOn(AWS, "SecretsManager");
    const res = await handler();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockgetSecretValue).toHaveBeenCalledTimes(2);
    expect(res).toEqual("secret-1-value and secret-2-value");
  });
});
```

Using this pattern we are able to create strong unit and integration tests that run
independently of the AWS dependencies in our code. check out the code on
[GitHub](https://github.com/LucasAmos/AWS/tree/master/mockingwithjest)
