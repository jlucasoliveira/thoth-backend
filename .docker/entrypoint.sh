#!/bin/sh

cd /home/node/app
npm i
# npx prisma migrate dev
npm run start:debug
