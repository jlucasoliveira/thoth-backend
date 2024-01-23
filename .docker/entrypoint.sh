#!/bin/sh

cd /home/node/app
npm i
npm rebuild bcrypt --build-from-source
npx prisma migrate deploy
npm run start:debug
