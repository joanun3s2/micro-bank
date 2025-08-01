# Micro-bank

## Description

This a simple project which emulates the basic working of a bank based on microservices.
It should be able to make operations like, create or update users and make transactions between different accounts.

## Requirements

Will need to install the following before proceeding to the project setup

- Node (preferably 22 or 20)
- Docker compose

## Project setup

First install all the dependencies needed

```bash
$ npm install
```

Then you can run the setup (Note that after it finishes the project might be running on docker containers)

```bash
$ npm run setup
```

## Compile and run the project

```bash
# will run in dev mode on a detached container
$ npm run start

# will run in watch mode directly on you machine terminal
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

The tests are individuals for each service, so you need to navigate to the directory of the one you want to test and run the following.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e (not working yet)
```

For more details about the testing, read TESTING.md.

## Deployment

This will be update when needed

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Handy tools to have

Check out a few tools or extensions that may come in handy when working with project (in a VSCode environment specially):

- Extensions
  - Docker
  - Prettier
  - ESLint
  - Windsurf
- Apps
  - DBeaver
  - Insomnia

## Stay in touch

- Author - [Joao](https://github.com/joanun3s2)
- Website - [Will be updated](Limatecnologia.com)

## License

This code is under MIT license.
