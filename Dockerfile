# syntax=docker/dockerfile:1

FROM node:12.18.2

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

RUN yarn codegen

RUN yarn build

COPY . .

CMD [ "yarn", "start" ]