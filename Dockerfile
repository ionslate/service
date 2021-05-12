FROM node:12-alpine

ARG api_url

ENV REACT_APP_API_URL=$api_url

ENV NODE_ENV=production
ENV PORT=8080

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY ["package.json", "yarn.lock", "/opt/app"]
RUN yarn install

COPY . /opt/app

RUN yarn codegen
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]