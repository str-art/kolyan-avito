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

    tor -f "$TORRC_PATH" --verify-config | $ENTRYPOINT_FOLDER/tor-log.sh

    tor -f "$TORRC_PATH" > $LOG_FILE &

    info "Bootstraping tor"

    (tail -f $LOG_FILE | $ENTRYPOINT_FOLDER/tor-log.sh) &

    wait_for_bootstrap "$LOG_FILE" "$SUCCESS"

    info "Tor bootstrap finished"
}

run_bot(){
  BOT_COMMAND="$(which node) $BOT_DIR/$@"

  info "Launching bot"

  $BOT_COMMAND | $ENTRYPOINT_FOLDER/handler-log.sh

  return 1
}

info "Container starting"

info "Parameters are: $@"

bootstrap_tor

run_bot "$1"

info "Bot exited"