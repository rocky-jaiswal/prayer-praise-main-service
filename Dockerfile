FROM node:12-alpine

RUN mkdir /app

COPY ./harden.sh /usr/local/bin/harden.sh
RUN /usr/local/bin/harden.sh

ADD . /app

WORKDIR /app

RUN rm -rf /app/test
RUN rm -rf /app/postgres
RUN rm -rf /app/node_modules

ENV NODE_ENV production
RUN yarn install --production
RUN yarn migrate-latest

EXPOSE 8090

CMD node index.js
