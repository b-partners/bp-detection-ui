#!/usr/bin/env bash

npm run dev -- --port 3000 & 
PID1=$!
npx cypress open --e2e & 
PID2=$!

cleanup() {
  echo "Stopping..."
  kill -TERM $PID1 $PID2 2>/dev/null
  wait $PID1 $PID2 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

wait $PID1 $PID2