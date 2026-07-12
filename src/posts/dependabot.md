---
title: "Automerging dependabot Pull Requests"
subtitle: "With a Github Actions auto approval job"
date: "2026-07-12"
previewImage: images/githublarge.png
---

## What is dependabot?

Dependabot is a tool for automatically finding and fixing vulnerable dependencies, once enabled on your repository dependabot will open Pull Requests to upgrade your dependencies. This post assumes that depdendabot is already configured on your repository.

## Why automerge?

Projects with a low level of maturity require manual releases and testing, as such they are not suitable for automated vulnerability remediation. However more mature projects that have comprehensive testing often still require dependabot Pull Requests to be merged manually, if you have confidence in your testing and CI/CD pipeline manual approvals serve only to keep your application insecure for longer. By automerging dependabot PRs the window of time that your application is vulnerable is minimised.

## How to automerge dependabot Pull Requests

There are a few github actions available that will automerge dependabot Pull Requests. However, considering that it is absolutely trivial to write your own action these serve no purpose other than to introduce another attack vector into your estate. Remember, every action has access to your `GITHUB_TOKEN` and any other secrets that are passed to the workflow, there is no reason to needlessly leave yourself open to a supply chain attack.

The following steps need to be performed

1. Create an action that triggers when `dependabot[bot]` opens a Pull Reuqest
2. Only trigger the action when the semver value is `patch` or `minor`
3. Run the CLI command `gh pr merge --auto --merge "$PR_URL"`

## GOTCHA

It's important to note that Pull Requests merged using the repository's `GITHUB_TOKEN` will [not trigger new workflow runs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow#triggering-a-workflow-from-a-workflow).
A Personal Access Token must be used instead, instructions on how to create one can be found [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

## The workflow

```yaml
name: Dependabot auto-merge
on: pull_request
permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-24.04
    if: github.event.pull_request.user.login == 'dependabot[bot]'
    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@25dd0e34f4fe68f24cc83900b1fe3fe149efef98
        with:
          github-token: "${{ secrets.DEPENDABOT_PAT }}"
      - name: Enable auto-merge for Dependabot PRs
        if: steps.metadata.outputs.update-type == 'version-update:semver-patch' || steps.metadata.outputs.update-type == 'version-update:semver-minor'
        run: |
          echo ${{steps.metadata.outputs.update-type }}
          gh pr merge --auto --merge "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GH_TOKEN: ${{secrets.DEPENDABOT_PAT}}
```

## How this works

1. `on: pull_request` ensures that the workflow only triggers when a Pull Request is opened
2. `github.event.pull_request.user.login == 'dependabot[bot]'` ensures that the job only runs if the Pull Request was created by dependabot
3. The `Dependabot metadata` step uses the `dependabot/fetch-metadata` action to fetch information about the dependabot run, which is used in step 4
4. ```yml
   if: steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
   steps.metadata.outputs.update-type == 'version-update:semver-minor'
   ```

   ensures that dependabot PRs containing breaking changes are not automerged. The docs for possible `update-types` are available [here](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#ignore--)

5. ```yml
   env:
     PR_URL: ${{github.event.pull_request.html_url}}
     GH_TOKEN: ${{secrets.DEPENDABOT_PAT}}
   ```

   adds the necessary environment variables; namely the PAT and the `PR_URL`

6. `gh pr merge --auto --merge "$PR_URL"` uses the github CLI to set the Pull Request to automerge, meaning that the PR will merge once all the checks have passed
