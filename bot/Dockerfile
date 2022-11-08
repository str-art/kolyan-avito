FROM node:14

ARG dir=.

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY ${dir} . 