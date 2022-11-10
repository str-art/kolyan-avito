FROM node:14

RUN apt-get update && apt-get -y install tor obfs4proxy

WORKDIR /etc/tor

COPY torrc ./

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . . 

RUN chmod +x ./init.sh

CMD ./init.sh