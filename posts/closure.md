---
title: "Javascript closures. What, why and how"
subtitle: "Simulate private variables using closures"
date: "2022-07-17"
previewImage: images/javascript.png
---

### What is a closure and why would I want to use one?

A JavaScript closure is a programming construct that allows a function to be permanently associated with the scope within which it was declared, the effect of this it to facilitate the creation of functions with access to long lived private variables.

## What is the use case?

Consider the following basic addition function which allows numbers to added to a count but not subtracted. This implementation works but the obvious issue is that the **count** variable has global scope and can be trivially reset by any function.

```js
let count = 0;

function add(value) {
  count = count + value;
}

add(2);
console.log(count);
add(3);
console.log(count);
```

```text
2
5
```

We can attempt to resolve this by moving the **count** variable inside the **add** function.

```javascript
function add(value) {
  let count = 0;

  count = count + value;
  return count;
}

console.log(add(2));
console.log(add(3));
```

However this does not work as the **count** value is now reset every time the function is called.

```text
2
3
```

## Implementing a closure

We can solve both of these issues by creating a function that returns a **count** variable along with a set of functions that control access to the **count**.

```js
function additionFactory() {
  let count = 0;

  return {
    add(value) {
      count = count + value;
    },

    reset() {
      count = 0;
    },

    value() {
      return count;
    },
  };
}

const counter = additionFactory();

counter.add(2);
console.log(counter.value());
counter.add(3);
console.log(counter.value());
```

```text
2
5
```

When the **additionFactory** function is called the in-scope local variables such as **count** come along for the ride, allowing the count to manipulated using only the defined **add** and **reset** functions, effectively creating private variables.

## Further reading

Learn more about using closures to simulate [private methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) and how to use [private classes methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields#private_methods)

ES2022 also includes support for [private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
