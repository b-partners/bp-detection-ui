#!/usr/bin/env sh
set -m

npm run dev -- --port 3000 & PID1=$!
npx cypress open --e2e & PID2=$!

cleanup() {
  kill -- -$$ 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

wait
