#!/usr/bin/env bash

timestamp(){
    date +"%H:%M:%S"
}

handler_log(){
    echo "$(timestamp) [HANDLER] $(format_handler_log $@)"
}

format_handler_log(){
    LOG="$@"
    echo "${LOG##*INFO}"
}


handler_log "Starting reading handler log"

while IFS= read -r line; do
        handler_log "$line"
done