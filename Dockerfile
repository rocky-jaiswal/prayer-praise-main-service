FROM node:12-alpine

RUN mkdir /app
WORKDIR /app

COPY ./harden.sh /usr/local/bin/harden.sh
RUN /usr/local/bin/harden.sh

ADD . /app
RUN yarn install --production

ENV NODE_ENV production

EXPOSE 8090

CMD node /app/index.js

