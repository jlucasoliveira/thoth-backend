FROM node:20-alpine3.18

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN npm config set cache /home/node/app/.npm-cache --global

USER node

WORKDIR /home/node/app

COPY . .
