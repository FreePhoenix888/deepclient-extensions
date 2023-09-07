# Contributing to `@freephoenix888/deepclient-extensions`

We welcome contributions to our project! To ensure a smooth process, please follow the guidelines below.

## Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`

## Making Changes

1. Create a new branch: `git checkout -b feature/your-branch-name`
2. Make your changes and test them.
3. Stage your changes: `git add .`

## Committing Changes

Use `git commit` without `-m`/`--message` option because `commitizen` will prompt you to fill out any required commit fields at commit time

```
git commit
```

Otherwise you can use `npm run commit` or `npx cz` to commit your changes

```
npm run commit
```

```
npx cz
```

## Pushing Changes

1. Push the changes to your fork: `git push origin feature/your-branch-name`
2. [Create a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) from your fork to the main repository.
