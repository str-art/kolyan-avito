#!/usr/bin/env bash

long_task(){
    for i in {1..100}
    do
        echo "$i%"
        sleep 1
    done
}

long_task