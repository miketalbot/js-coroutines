#!/usr/bin/env sh

rm -rf dist
NODE_ENV=production babel src/component/* --ignore "__tests__","**/*.spec.js","**/*.test.js","__snapshots__" --out-dir dist
cp -r src/component dist/es6
rm -rf dist/es6/yastjson/test
