#!/usr/bin/env bash

timestamp(){
    date +"%H:%M:%S"
}

tor_log(){
    echo "$(timestamp) [TOR]$(tor_format $1)"
}

tor_format(){
    STRING="$@"
    echo "${STRING##*]}"
}

tor_log "] Starting reading tor log"

while IFS= read -r line; do
        tor_log "$line"
done