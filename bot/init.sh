#!/bin/bash
touch log.txt

tor > log.txt &

(tail -f log.txt | grep -q "100%"; node index) &

tail -f log.txt