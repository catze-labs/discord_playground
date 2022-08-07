# Catze Discord Bot Test Repo

## Tech Stack

### Server : NestJS + Prisma

### Client : multiple web + Discord Bot

## Directory Information

- `/bot` : discord bot
- `/prisma` : prisma ORM setting files
- `/src` : NestJS src files

## Installation

```bash
$ npm install
```

## Running the app

## Before Running

### Setting Steps
- NestJS running not needs spcial .env files
- For Running Discord Bot, You should make `.env` in `project root`(For NestJS and Prisma) and `./bot`(For Discord Bot) for set specific env variables.
- Prisma setting :  `npx prisma generate`

If you completely followed Setting Steps, Run command down below, which you need.

```bash
$ npm install

# NestJS Default Commands Choose one.
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# open another terminal
$ cd bot
$ node deploy-commands.js
$ node bot-main.js
```

## Test

```bash
# NestJS Default Commands
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Email to `phantola@cybergalznft.com`

## Other Info

- npx prisma migrate dev --name "init" => DB 엔티티 초기화
