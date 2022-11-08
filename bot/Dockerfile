FROM node:14

ARG dir=.

WORKDIR /usr/src/server

COPY ${dir}/package*.json ./

RUN npm install

COPY ${dir} . 