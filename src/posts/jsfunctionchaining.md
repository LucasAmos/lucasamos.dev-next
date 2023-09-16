---
title: "How to create chainable functions using Javascript"
subtitle: "something().pretty().cool().is().happening().here()"
date: "2020-08-02"
previewImage: images/javascript.png
---

#### Often it is necessary to write code that must run sequentially, with the input of one function dependent on the output of another. Continue reading to learn how to uses classes and chaining to avoid nested function calls and verbose code.

&NewLine;

## Don't do this

This doesn't look too bad but nesting function calls like this can quickly become unreadable. The semantics of the code only makes things worse as it reads from left to right whereas the data flows from right to left. Just avoid this.

```javascript
const word = new Word("string");

word.functionOne(word.functionTwo(word.functionThree()));
```

## Or this

This is more readable but your productivity will plummet if you have to write all of your function calls this way. Fortunately there is a better solution.

```js
const word = new Word();

const result1 = word.functionOne("string");
const result2 = word.functionOTwo(result1);
const result3 = word.functionThree(result2);
```

## Do THIS

The solution is to create functions that are easily chainable like this **function1().function2().function3()**. We can achieve this easily by utilising JavaScript classes and the **this** keyword.

In JavaScript **this** refers to the current object instance, if you're not familiar with it you can read more about it here. All you need to know is that when we create a new object such as **const newObject = new ourNewClass()** this refers to newObject

Using the code below we can create a class that will allow us to easily perform string manipulations. When creating an instance of the **Word** class we use the new operator **const word = new Word("acoolstring")**. We pass the initial string into the constructor which is stored in the **this.str** variable.

With each function that we define on the class we perform the specified string manipulation, storing the result in **this.str**. Instead of returning the string we return **this** which returns the class instance. As the class is returned we have access to all of the functions defined in that class, calls to which will have access to the result of any previous string manipulations that are stored in **this.str**.

```js
class Word {
  constructor(init) {
    this.str = init;
  }
  getWord() {
    return this.str;
  }
  double() {
    this.str += this.str;
    return this;
  }
  capitalise() {
    this.str = this.str.replace(/^w/, (c) => c.toUpperCase());
    return this;
  }
  lowercase() {
    this.str = this.str.toLowerCase();
    return this;
  }
  uncapitalise() {
    this.str = this.str.replace(/^w/, (c) => c.toLowerCase());
    return this;
  }
  uppercase() {
    this.str = this.str.toUpperCase();
    return this;
  }
  reverse() {
    this.str = this.str.split("").reverse().join("");
    return this;
  }
}
```

## Using the chainable function calls

Chaining the function calls together is simple. First we use the **new** operator to create a new instance of the **Word** class, remembering to initialise it with acoolstring. Then we can chain together as many function calls as we want. Remember, you will always need to call the **getWord()** function to return the final result of the function calls as all of the other functions will return the class instance.

```js
const word = new Word("acoolstring");
console.log(word.capitalise().double().reverse().getWord());
```

```js
gnirtsloocAgnirtsloocA;
```

The output is pretty unintelligible but the cool thing is that with chainable functions you can even call functions multiple times so we can easily reverse the string again

```js
console.log(word.capitalise().double().reverse().reverse().getWord());
```

```js
AcoolstringAcoolstring;
```

As always the code is available on [GitHub](https://github.com/LucasAmos/AWS/blob/master/ChainingFunctions/index%2C.js)
