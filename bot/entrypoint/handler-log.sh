#!/usr/bin/env bash

timestamp(){
    date +"%H:%M:%S"
}

handler_log(){
    echo "$(timestamp) [BOT] $(format_handler_log $@)"
}

format_handler_log(){
    LOG="$@"
    echo "${LOG##*INFO}"
}


handler_log "Starting reading bot log"

while IFS= read -r line; do
        handler_log "$line"
done