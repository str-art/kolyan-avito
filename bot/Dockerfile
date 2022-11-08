FROM node:14

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . . 

RUN ls -a