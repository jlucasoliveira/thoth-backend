#!/bin/sh

cd /home/node/app
npm i
npm rebuild bcrypt --build-from-source
npm run start:debug
