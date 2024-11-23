# Simple IoT Backend - Sensor Data Service

## Description

A microservice for simple iot backend handling sensors data operation.

## Requirements

1. Node.js (version >= 16)
2. MongoDB (Tested on 8.0)

## Project setup

1. Clone this project and install node.js packages

    ```bash
    $ npm install
    ```

2. Update environment variables in `.env.development.local` (Dev) or `.env` (Prod)

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test
```