#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/cypress-realworld-app

yarn dev > /tmp/rwa.log 2>&1 &
app_pid=$!

cleanup() {
  exit_code=$?

  if [ "$exit_code" -ne 0 ]; then
    echo "----- RWA log -----"
    tail -150 /tmp/rwa.log || true
  fi

  kill "$app_pid" 2>/dev/null || true
  wait "$app_pid" 2>/dev/null || true
}

trap cleanup EXIT

ready=0

for attempt in {1..90}; do
  if curl -fsS http://localhost:3000/signin > /dev/null &&
     curl -fsS http://localhost:3001/ > /dev/null; then
    ready=1
    break
  fi

  if ! kill -0 "$app_pid" 2>/dev/null; then
    break
  fi

  sleep 2
done

if [ "$ready" -ne 1 ]; then
  echo "RWA did not become ready on ports 3000 and 3001." >&2
  exit 1
fi

cd /opt/playwright-portfolio

npm run check
npx playwright test "$@"