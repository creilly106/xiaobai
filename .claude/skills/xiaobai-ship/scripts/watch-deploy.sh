#!/usr/bin/env bash
# Wait for a pushed commit's CI run and Vercel deploy, then report both.
#
#   bash .claude/skills/xiaobai-ship/scripts/watch-deploy.sh [sha]     (default: HEAD)
#
# Exits non-zero if either fails; on a CI failure it prints the failing log lines.
set -u
SHA=$(git rev-parse --short "${1:-HEAD}")
FULL=$(git rev-parse "${1:-HEAD}")
REPO=creilly106/xiaobai
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Watching $SHA on $BRANCH"
# The run appears a few seconds after the push.
RUN=""
for _ in $(seq 1 30); do
  RUN=$(gh run list --repo "$REPO" --commit "$FULL" --limit 1 --json databaseId --jq '.[0].databaseId' 2>/dev/null)
  [ -n "$RUN" ] && break
  sleep 3
done
CI=fail
if [ -n "$RUN" ]; then
  if gh run watch "$RUN" --repo "$REPO" --exit-status >/dev/null 2>&1; then CI=ok; fi
else
  echo "No CI run found for $SHA"
fi
echo "CI: $CI"
if [ "$CI" != ok ] && [ -n "$RUN" ]; then
  gh run view "$RUN" --repo "$REPO" --log-failed 2>&1 | grep -iE "error|fail|✗|×" | head -20
fi

# Vercel reports as a commit status; branches with deploys switched off never get one.
VERCEL=none
for _ in $(seq 1 60); do
  VERCEL=$(gh api "repos/$REPO/commits/$FULL/status" --jq '.statuses[] | select(.context=="Vercel") | .state' 2>/dev/null | head -1)
  [ -n "$VERCEL" ] && [ "$VERCEL" != pending ] && break
  sleep 10
done
echo "Vercel: ${VERCEL:-no deploy (expected on a branch with deploys switched off)}"

[ "$CI" = ok ] && { [ "$VERCEL" = success ] || [ -z "$VERCEL" ]; }
