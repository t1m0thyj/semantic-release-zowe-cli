#!/bin/sh

# Use annotated tags
if ! grep -q "['tag', tagName, ref]" node_modules/semantic-release/lib/git.js; then
  echo >&2 "semantic-release package is an unsupported version"
  exit 1
fi
sed -i "s/['tag', tagName, ref]/['tag', tagName, ref, '-s', '-m', process.env.GIT_TAG_MESSAGE]/" node_modules/semantic-release/lib/git.js

# Sign off commits
if ! grep -q "['commit', '-m', message]" node_modules/@semantic-release/git/lib/git.js; then
  echo >&2 "@semantic-release/git package is an unsupported version"
  exit 1
fi
sed -i "s/['commit', '-m', message]/['commit', '-s', '-m', message]/" node_modules/@semantic-release/git/lib/git.js

npx semantic-release "$@"
