---
title: "Mock network requests using Jest and node-fetch"
subtitle: "Ensure your application functions correctly by simulating server responses"
date: "2022-06-05"
previewImage: images/jest.png
---

## Why mock network requests?

From my experience most bugs occur at the interfaces between modules and what clearer interface is there than an API call? Thus testing network requests is clearly important, but it is also difficult. Do you want to maintain a test API server? Does your CI/CD infrastructure allow outbound network requests? Does it matter that network latency will slow down your tests? These are difficult issues that can be resolved by mocking the network request and its response. This is how we can do it using jest and node-fetch

## The request function

The following function makes a **POST** request using [node-fetch](https://www.npmjs.com/package/node-fetch) and returns the response.

```javascript
import fetch, { Response } from "node-fetch";

export async function sendPostRequest(body: object) {
  const { WEBHOOK_URL } = process.env;

  const response: Response = await fetch(WEBHOOK_URL, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}
```

## Test code

As we are mocking the entire **fetch** function the key thing is to test the boundary between our code and **node-fetch**.
We can achieve this by using **toHaveBeenLastCalledWith** to assert that the **fetch** function is called with correct parameters.

As we can rely on the fact that that the authors of **node-fetch** have tested their code we can trust that when called with the correct parameters the **fetch** function will work as intended.

As we are populating our URL from an environment variable we also need to set this in the **beforeAll** hook.

This code allows us to test the **sendPostRequest** function however you should also write a test to ensure that function behaves as expected when an error occurs.

```javascript
jest.mock("node-fetch");

import fetch from "node-fetch";
import { sendPostRequest } from "../src/requests";

beforeAll(() => {
  process.env.WEBHOOK_URL = "https://fakeurl.com/posts";
});

test("sendPostRequest makes request with correct parameters and returns expected response", async () => {
  fetch.mockReturnValue(
    Promise.resolve({
      json: () =>
        Promise.resolve({
          id: 1,
          test: "data",
        }),
    })
  );
  const response = await sendPostRequest({ real: "data" });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenLastCalledWith("https://fakeurl.com/posts", {
    body: '{"real":"data"}',
    headers: { "Content-Type": "application/json" },
    method: "post",
  });
  expect(response).toEqual({
    test: "data",
    id: 1,
  });
});
```

## Get the code

All of the code is available on [GitHub](https://github.com/LucasAmos/jest/blob/master/__tests__/requests.test.ts)
