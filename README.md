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

- NestJS running not needs spcial .env files
- For Running Discord Bot, You should make `.env` `project root`(For NestJS and Prisma) and `./bot`(For Discord Bot) for set specific env variables.

### Prisma setting Need!! - `npx prisma generate`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
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
