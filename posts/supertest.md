---
title: "Testing an express API using SuperTest"
subtitle: "Testing is an essential part of any application. Learn
  how to use SuperTest to ensure that your Express API functions as intended and
  confidently make changes to your code without breaking it"
date: "2020-05-28"
previewImage: images/supertest.png
---

#### Testing is a key part of any software development process, using SuperTest you can ensure your HTTP endpoints and express controllers function as intended.

&NewLine;

## Why you should test every level of your application

Comprehensive Testing across all levels of the codebase is a requirement for any serious software application yet too many developers and companies don't take testing seriously. Without testing, especially at the interfaces between software modules you cannot have confidence that your software functioned as intended when it was built and you certainly cannot have confidence that it functions as intended once changes have been made to it.

## Why SuperTest?

[SuperTest](https://github.com/visionmedia/supertest#readme) is a popular library for testing HTTP endpoints, it has a high level API that makes testing effortless and is compatible with many API frameworks and all test frameworks. In this example we will user SuperTest to test a basic API written using [Express](https://expressjs.com/)

## Dependencies

First create a new node project using **yarn init**. We will require two packages to create the API and two to test it. Install express and body-parser as dependencies and Jest and supertest as dev dependencies. This can be done with the commands **yarn add express bodyparser** and **yarn add jest supertest --dev**

## Setting up the app

First we need to create the express app that will serve up our endpoints, this is also where we can configure any middleware that the app will use. In this case we will be using the body-parser library so that we can easily handle the request body. Make sure to export the app variable as we will need to use this in our tests.

```js
const express = require("express");
const bodyParser = require("body-parser");
let app;
app = express();
app.use(bodyParser.json());

module.exports = app;
```

<br>

## Creating a controller

The controller is where the API routes are defined and where any application logic may be placed, though for an application of any significant size you will want to split this into a separate files. We will create a controller with three routes; one for fetching all users, one for fetching a specific user and finally one for creating a user.

In this example we will just hard code some boilerplate responses but in your app you will want to mock any database calls using Jest, you can read all about mocking [here](https://jestjs.io/docs/en/mock-functions.html).

```js
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  return res.json("Return all the users");
});

router.get("/:id", function (req, res) {
  if (req.params.id === "user1") {
    return res.json("user 1 returned");
  }
  return res.status(404).json("user not found");
});

router.post("/", function (req, res) {
  let content = req.body;
  if (content.id) {
    return res.status(201).json({ id: "user1" });
  }
  return res.status(400).json("User could not be created");
});

module.exports = router;
```

## Setting up the test suite

Before we can test our application we need to configure our test setup. First we will require SuperTest and store it in the request variable. We will also need to require the controller and app files that we created earlier.

Once we have imported all of the required files and libraries we can continue to set up our tests. We will use the two Jest functions **beforeAll** and **afterAll** to perform some setup and teardown tasks. These commands will run once before and once after the entire test suite executes. Make sure not to confuse this with the **beforeEach** and **afterEach** functions which will run before every test. That functionality is very useful but is not what we need here.

In the **beforeAll** function we will tell our express app to use the userController that we defined. In the **afterAll** function we will stop the app from listening when all our tests have finished, this will prevent any resource leaks.

```js
const request = require("supertest");
const userController = require("../controllers/user");
const app = require("../app");

describe("User controller", () => {
  beforeAll(() => {
    app.use(userController);
  });

  afterAll(() => {
    app.listen().close();
  });
});
```

<br>

## Testing the GET all users endpoint

Using the **request** function that we imported at the top of the file we will write our first test between the **beforeEach** and **afterEach** blocks.

The only thing we need to do to get the response of a GET request from the / endpoint of our controller is to call the **request(app).get("/")** function and pass our app in as a parameter, storing the HTTP response in a variable. It's as simple as that!

Once we have stored the response we can perform test assertions on it using Jest. As a rule I always test the expected response and the expected StatusCode that the request should return. This adds extra resilience to your tests as an application may behave differently when a **200** status code is returned than when a **201** status code is returned, even if the response body is the same.

SuperTest runs asynchronously so make sure to use the **async/await** syntax when writing your tests. Some linters recommend using the promise syntax when writing async tests but I prefer using the **done()** function as it makes tests more readable. Don't forget to call **done()** at the end of the test otherwise Jest will not be able to determine when the test has finished running and it will time out.

```js
test("GET / endpoint returns all users", async (done) => {
  const res = await request(app).get("/");
  const { body, statusCode } = res;
  expect(body).toEqual("Return all the users");
  expect(statusCode).toEqual(200);
  done();
});
```

<br>

## Testing the GET valid user endpoint

Testing the GET user endpoint is similar to the previous test; pass in the **/user1** path to the SuperTest **.get()** function.

```js
test("GET /:id endpoint returns the correct user", async (done) => {
  const res = await request(app).get("/user1");
  const { body, statusCode } = res;

  expect(body).toEqual("user 1 returned");
  expect(statusCode).toEqual(200);
  done();
});
```

<br>

## Testing the invalid GET user endpoint

When testing an API it is good practice to test both the expected successful response and the expected unsuccessful response. Here we will test that the correct response body and status code are returned when the id of a non existent user is passed as a path parameter.

```js
test("GET /:id endpoint returns the correct error", async (done) => {
  const res = await request(app).get("/user2");
  const { body, statusCode } = res;

  expect(body).toEqual("user not found");
  expect(statusCode).toEqual(404);
  done();
});
```

<br>

## Testing the POST user endpoint

Testing GET requests using SuperTest is very simple and testing POST requests is not much more complicated. Firstly we will use **.post("/")** to initiate a post request.
We will also need to set the type of data that will be sending to the API endpoint, which we can do by chaining **.set("Accept", "application/json")** to the **.post("/")** function.

Finally we can use the **.send()** function to specify the request body, other HTTP requests such as **PUT** and **PATCH** are executed in the same way using their relevant functions.

```js
jest("POST / endpoint returns the correct response", async (done) => {
  const res = await request(app)
    .post("/")
    .set("Accept", "application/json")
    .send({
      id: "user1",
    });
  const { body, statusCode } = res;
  expect(body).toEqual({ id: "user1" });
  expect(statusCode).toEqual(201);
  done();
});
```

## Overview

This is a basic introduction to SuperTest, a great library for testing your API. When testing a production API you will want to use the mocking features of Jest to replace any database calls or requests to third party API such as AWS Cognito. Another good practice is to write an [OpenAPI](https://swagger.io/specification/) specification for your API, this way you can validate a request before it even reaches your controller and return meaningful errors should the request be in the incorrect format, this will be covered in a future blog post!

As always you can view all of the code on [GitHub](https://github.com/LucasAmos/AWS/tree/master/SuperTest)
