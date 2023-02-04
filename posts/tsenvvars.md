---
title: How to type NodeJS environment variables using TypeScript
subtitle: Fix the error Type 'undefined' is not assignable to type 'string'
date: "2023-02-04"
previewImage: images/typescript.png
---

## Type 'undefined' is not assignable to type 'string'

If you've been using TypeScript for a while you might have encountered the following error when accessing an environment variable.

```js
Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.ts(2322)
```

![Environment variables with error](/images/tsenvvars1.png)

This can be resolved by Typing process.env in the NodeJS Namespace. We do this by creating the file **additional.d.ts** in the root directory and definining the environment variable types.

```js
declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_KEY_ID: string;
    SECRET_ACCESS_KEY: string;
    EMAIL: string;
  }
}
```

<br/>

Make sure to add **additional.d.ts** to the **includes** array of **tsconfig.json**

```js
{
  ...
  "include": ["additional.d.ts"]
}
```

<br/>

The error is now gone
![Environment variables with error fixed](/images/tsenvvars2.png)
