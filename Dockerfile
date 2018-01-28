FROM node:8-alpine

RUN mkdir -p /opt/db
RUN mkdir /app
WORKDIR /app

COPY ./harden.sh /usr/local/bin/harden.sh
RUN /usr/local/bin/harden.sh

ADD . /app
RUN yarn install --production

ENV NODE_ENV production

EXPOSE 3001

CMD node /app/index.js

