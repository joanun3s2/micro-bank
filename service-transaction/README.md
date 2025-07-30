# Bank transactions microservice

## Description

This is the microservice which handles the transactions between clients accounts.

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

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

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
- Apps
  - DBeaver
  - Insomnia

## Stay in touch

- Author - [Joao](https://github.com/joanun3s2)
- Website - [Will be updated](Limatecnologia.com)

## License

This code is under MIT license.
