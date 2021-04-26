FROM node:12.18.2
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