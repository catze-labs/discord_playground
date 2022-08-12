# Catze Discord Bot Test Repo

## Tech Stack

### Server : NestJS + Prisma

### Client : multiple web + Discord Bot

## Directory Information

- `/bot` : discord bot
- `/prisma` : prisma ORM setting files
- `/src` : NestJS src files
- `/test/{Nest endpoint path}` : k6 test script path
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


## API Test (k6)
You should install k6 first, how to : https://k6.io/docs/getting-started/installation/

If k6 installation is finished, Follow steps.

### Steps for run test with k6
1. make a file `/test/{endpoint_path}/api-test-script.js`
    For example, If your test nestjs controller like `@Controller('health')`
    then, mak a file `/test/health/api-test-script.js`.

2. write test script `api-test-script.js` with k6

3. Run command `npm run api-test {endpoint_path}`
    For example, `npm run api-test health`

4. You can find result file in `/test/test_result/{endpoint_path}/~_result.txt`

NOTE : if you want to see k6 process in terminal, run command `k6 run /test/{endpoint_path}/api-test-script.js`


## Jest Test

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

- npx prisma migrate dev --name "init" => DB Table initialization. (roll back and re-generate tables)
- according to `.github/workflows/aws.yml`, `.md`, `.gitignore`, `.eslintrc`, `.prettierrc` files not affect to github action.
