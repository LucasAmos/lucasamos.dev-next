---
title: "Using Jest to selectively mock functions and classes"
subtitle: "Level up your testing by using spies to isolate specific functions"
date: "2022-04-09"
previewImage: images/jest.png
---

In a [previous article](/articles/jestmocking) I demonstrated how to mock the AWS SDK. But what if instead of mocking an entire library or file we only want to mock specific functions exported from a module or certain class functions?

## Mocking module functions

Consider the following module which exports two functions. If we wanted to mock the entire module we could simply use **jest.mock('./moduleName')** or write our mocks in the **\_\_mocks\_\_** directory. However, this would mock all functions contained in the module. To mock individual functions the solution is to use Jest's
[requireActual](https://jestjs.io/docs/jest-object#jestrequireactualmodulename) function.

```js
function functionOne() {
  return "functionOne original implementation";
}

function functionTwo() {
  return "functionTwo original implementation";
}

export { functionOne, functionTwo };
```

Using requireActual combined with JavaScript's
[spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator it is possible to mock specific module functions in isolation.

```js
import { functionOne, functionTwo } from "../src/functions";

jest.mock("../src/functions", () => {
  const originalModule = jest.requireActual("../src/functions");

  return {
    __esModule: true,
    ...originalModule,
    functionTwo: jest.fn(() => "functionTwo mocked implementation")
  };
});

test("function one", () => {
  expect(functionOne()).toEqual("functionOne original implementation");
});

test("function two", () => {
  expect(functionTwo()).toEqual("functionTwo mocked implementation");
});
```

## Mocking class functions

A different approach is required for mocking class functions.

```js
export default class ClassMock {
  constructor() {}

  static queryOne() {
    return "queryOne original data";
  }

  static queryTwo() {
    return "queryTwo original data";
  }
}
```

Using Jest's [spyOn](https://jestjs.io/docs/jest-object#jestspyonobject-methodname)
function we can mock one class function in isolation. As we have implemented the test
using spies we can leverage Jest's **toHaveBeenCalled** function to assert that
the function under test has only be called the expected number of times.

```js
import ClassMock from "../src/class";
const queryTwoSpy = jest
  .spyOn(ClassMock, "queryTwo")
  .mockImplementation(() => "queryTwo mocked data");

test("classMock one", () => {
  expect(ClassMock.queryOne()).toEqual("queryOne original data");
});
test("classMock two", () => {
  expect(ClassMock.queryTwo()).toEqual("queryTwo mocked data");
  expect(queryTwoSpy).toHaveBeenCalled();
});
```

Here we have seen how to mock individual module and class functions while leaving the
remaining functionality intact. This can be useful when certain functions interface with services outside of your control such as APIs or persistance libraries that already well tested. View the code for these tests on [GitHub](https://github.com/LucasAmos/jest), this repository is also fully set up to use Jest, TypeScript, Prettier & eslint.
