FROM node:20-alpine3.18

RUN npm config set cache /home/node/app/.npm-cache --global

USER node

WORKDIR /home/node/app

COPY . .
