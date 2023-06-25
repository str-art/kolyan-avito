#!/usr/bin/env bash

timestamp(){
    date +"%H:%M:%S"
}

info(){
  echo "$(timestamp) [INFO] $1"
}

tor_log(){
    echo "$(timestamp) [TOR]$(tor_format $1)"
}

tor_format(){
    STRING="$@"
    echo "${STRING##*]}"
}

bootstrap_tor(){
    LOG_FILE="/tmp/tor_log.txt"

    tor > $LOG_FILE &

    (tail -f $LOG_FILE | tor_log) &

    tail -f $LOG_FILE | grep -q "100%"
}

run_labmda_ric(){
    APP_HANDLER="$1"

    $(which npx) aws-lambda-ric $APP_HANDLER
}

(sleep 1; tor_log "Jun 24 09:44:30.000 [notice] Bootstrapped 25%: Loading networkstatus consensus") &

info "running"