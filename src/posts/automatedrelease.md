---
title: "Automating releases with releaseit"
subtitle: "Bonus: how to commit to a protected branch"
date: "2025-11-07"
previewImage: images/githublarge.png
---

### Why use release automation?

Anyone who has manually tagged and released code artifacts will attest to how tedious and error prone a task this is, fortunately it can be automated!

## The workflow to be automated

I needed to automate a number of tasks:

1. Tagging merges to **master**
2. Creating a release for each tag
3. Publishing a package to github package registry
4. Generating release notes
5. Calculating the next semantic version nunber for the **package.json** file
6. Updating the **yarn.lock** file
7. Committing the **CHANGELOG.md**, **package.json** and **yarn.lock** file to the **master** branch after every release

## Choosing the tool

There are a number of libraries available for automating release workflows, two of the most popular are [semantic-release](https://github.com/semantic-release/semantic-release) and [releaseit](https://github.com/release-it/release-it). I have used semantic-release in the past and found it to be quite unreliable with weird unexpected behaviours so when I decided to automate my next workflow I chose release-it

## Using conventional commits

Releaseit determines the next version number by examining commit messages, therefore I had to ensure that all commits conformed to the [conventional-commit ](https://www.conventionalcommits.org/en/v1.0.0/)standard. To mandate this I created **commitlint.config.cjs** in the repository root

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-max-line-length": [0, "always"],
    "scope-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
  ignores: [(message) => message.startsWith("Released version")],
};
```

I then added a github action job to ensure that bad commits could not be merged

```yaml
jobs:
  commitlint:
    name: Lint commit messages
    runs-on: ubuntu-22.04
    environment:
      name: ci
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Lint commits
        uses: wagoid/commitlint-github-action@b948419dd99f3fd78a6548d48f94e3df7f6bf3ed
```

## Creating the configs

As I am using a monorepo I needed to use two **.release-it.json** configuration files; one at the root level and one in the package. For simplicity I decided to maintain the same version number across all **package.json** files, otherwise I would need to write a custom config to parse the scope of each commit and version packages independently

### Root level config

```yaml
{
  "$schema": "https://unpkg.com/release-it@19/schema/release-it.json",
  "git":
    {
      "commitMessage": "chore: release v${version} [skip ci]",
      "commitsPath": ".",
      "push": true,
      "requireCommits": true,
      "requireCleanWorkingDir": false,
      "requireCommitsFail": false,
      "tagName": "${version}",
      "release": true,
    },
  "github":
    {
      "release": true,
      "releaseName": "${version}",
      "tokenRef": "GITHUB_TOKEN",
      "comments": { "submit": true },
    },
  "npm": false,
  "hooks": { "after:bump": "yarn --mode update-lockfile" },
  "plugins":
    {
      "@release-it-plugins/workspaces": { "skipChecks": true, "publish": false },
      "@release-it/conventional-changelog":
        {
          "gitRawCommitsOpts": { "path": "." },
          "infile": "CHANGELOG.md",
          "path": ".",
          "preset":
            {
              "name": "conventionalcommits",
              "types":
                [
                  { "section": "Features", "type": "feat" },
                  { "section": "Bug Fixes", "type": "fix" },
                  { "section": "Tests", "type": "test" },
                  { "section": "Chores", "type": "chore" },
                  { "section": "Documentation", "type": "docs" },
                  { "section": "Performance Improvements", "type": "perf" },
                  { "section": "Code Refactoring", "type": "refactor" },
                  { "section": "Code Style Changes", "type": "style" },
                  { "section": "Build Changes", "type": "build" },
                  { "section": "Continuous Integration", "type": "ci" },
                  { "section": "Reverts", "type": "revert" },
                ],
            },
        },
    },
}
```

### Package config

```yaml
{
  "$schema": "https://unpkg.com/release-it@19/schema/release-it.json",
  "git": false,
  "npm": { "publish": true, "publishConfig": { "registry": "https://npm.pkg.github.com" } },
  "plugins":
    {
      "@release-it/conventional-changelog":
        {
          "infile": false,
          "preset":
            {
              "name": "conventionalcommits",
              "types":
                [
                  { "section": "Features", "type": "feat" },
                  { "section": "Bug Fixes", "type": "fix" },
                  { "section": "Tests", "type": "test" },
                  { "section": "Chores", "type": "chore" },
                  { "section": "Documentation", "type": "docs" },
                  { "section": "Performance Improvements", "type": "perf" },
                  { "section": "Code Refactoring", "type": "refactor" },
                  { "section": "Code Style Changes", "type": "style" },
                  { "section": "Build Changes", "type": "build" },
                  { "section": "Continuous Integration", "type": "ci" },
                  { "section": "Reverts", "type": "revert" },
                ],
            },
        },
    },
}
```

The only remaining config left was to create a **release** script in the **package.json** files to ensure that releaseit first ran on the package and then at the top level of the monorepo

### Top level package.json

```json
    "scripts": {
        "release": "yarn workspace @lucasamos/sanity-studio release && yarn release-it --ci"
    }
```

### Library package.json

```json
    "scripts":{
     "release": "release-it --ci"
    }
```

### Running in a CI pipeline

The final step was to run the release in the CI pipeline

```yaml
name: Release

permissions:
  contents: write
  pull-requests: write
  packages: write
  id-token: write

on:
  push:
    branches:
      - master

concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.ref_name }}-schema

jobs:
  release:
    name: Release
    runs-on: ubuntu-22.04
    environment:
      name: Development
    steps:
      - uses: actions/checkout@v5
        with:
          ssh-key: ${{ secrets.DEPLOY_KEY }}
          fetch-depth: 0

      - name: setup npm auth token
        run: npm set //npm.pkg.github.com/:_authToken ${{secrets.GITHUB_TOKEN}}

      - name: set npm registry
        run: npm set @lucasamos:registry https://npm.pkg.github.com

      - name: corepack enable
        run: corepack enable

      - uses: actions/setup-node@v6
        with:
          node-version: 22

      - name: yarn install
        run: yarn install --immutable

      - name: git config
        run: |
          git config user.name "${GITHUB_ACTOR}"
          git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"

      - name: Release
        run: yarn run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Allowing your automation to commit to the protected master branch

If you have any sense then you have protected your **master** branch so that it cannot be committed to directly which means that your release job will not be able to commit the updated **CHANGELOG.md**

When I was looking for a solution to this problem I was amazed by how many people were stating that protecting **master** is only a "convenience". Well, it will not be very covenient if your deploys are automated and you unintenionally trigger one by pushing to **master**. Then think of the consequences when the junior dev copy and pastes a chatGPT generated command and force pushes to **master!**

The solution makes use of [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) and [deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys).

By protecting the **master** branch with rulesets you have the option to exempt deploy keys from the rule evaluations, an option that is not available when using classic branch protection rules

This configuration can be viewed on my [sanity-studio](https://github.com/LucasAmos/sanity-studio) repository
