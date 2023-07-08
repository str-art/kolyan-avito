#!/usr/bin/env bash

set -e

TRUE="TRUE"

timestamp(){
  date +"%H:%M:%S"
}

unixtimestamp(){
  date +%s
}

info(){
  echo "$(timestamp) [INFO] $1"
}

wait_for_bootstrap(){

  info "Waiting for bootstrap"

  file="$1"

  shift

  search_term="$1"

  shift

  wait_time="${1:-30s}"

  info "Looking for '$search_term' in '$file' for '$wait_time'"

  (timeout $wait_time tail -f "$file" &) | grep -q "$search_term" && return 0

  info "Timeout of $wait_time reached. Unable to find '$search_term' in '$file'"
  return 1
}



bootstrap_tor(){
    LOG_FILE="/tmp/tor-log-$(unixtimestamp).txt"

    SUCCESS="100%"

    FAILURE="Exiting."

    tor -f "$TORRC_PATH" --verify-config | /opt/tor-log.sh

    tor -f "$TORRC_PATH" > $LOG_FILE &

    info "Bootstraping tor"

    (tail -f $LOG_FILE | /opt/tor-log.sh) &

    wait_for_bootstrap "$LOG_FILE" "$SUCCESS"

    info "Tor bootstrap finished"
}

run_labmda_ric(){
    APP_HANDLER="$1"

    info "Launching lambda runtime with handler $APP_HANDLER"

    if [ -z "${AWS_LAMBDA_RUNTIME_API}" ]; then
      exec /usr/local/bin/aws-lambda-rie $(which npx) aws-lambda-ric $@
    else
      exec $(which npx) aws-lambda-ric $@ | /opt/handler-log.sh
    fi
}

info "Container starting"

info "Parameters are: $@"

bootstrap_tor

run_labmda_ric "$1"