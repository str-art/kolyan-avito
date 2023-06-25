FROM node:14

RUN apt-get update --allow-insecure-repositories && apt-get -y install tor obfs4proxy

ENV BOT_DIR=/opt/bot

ENV TORRC_PATH=/etc/tor/torrc

ENV ENTRYPOINT_FOLDER=/opt/entrypoint

ENV TZ=Asia/Omsk

COPY torrc ${TORRC_PATH}

WORKDIR ${BOT_DIR}

COPY package*.json ./

RUN npm install

COPY ./lib ./lib

COPY index.js .

COPY ./entrypoint ${ENTRYPOINT_FOLDER}

RUN chmod -R +x ${ENTRYPOINT_FOLDER}

CMD ${ENTRYPOINT_FOLDER}/entrypoint.sh "--unhandled-rejections=strict index.js"
