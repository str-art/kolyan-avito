FROM node:18-buster

ARG FUNCTION_DIR=/opt/avito

ENV NPM_CONFIG_CACHE=/tmp/.npm

ENV TORRC_PATH=/etc/tor/torrc

RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev \
    tor \
    obfs4proxy 

WORKDIR ${FUNCTION_DIR}

COPY package.json .

COPY torrc ${TORRC_PATH}

RUN npm install

RUN (cd /usr/local/bin/ && \
    curl -Lo aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64 \
    && chmod +x aws-lambda-rie )

COPY ./src .

COPY ./entrypoint /opt/

RUN chmod -R +x /opt

ENTRYPOINT [ "/opt/tor-entrypoint.sh" ]

CMD [ "app.handler" ]