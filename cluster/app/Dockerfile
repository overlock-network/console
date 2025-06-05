# syntax=docker/dockerfile:1

FROM node:20-slim AS base

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.4.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./

COPY ./app/package.json ./app/package.json

RUN yarn install

COPY . .

RUN yarn run next-build

ENV NODE_ENV=production

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "next-start"]
