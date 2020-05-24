#!/usr/bin/env sh

NODE_ENV=production babel src/component --ignore "__tests__","**/*.spec.js","**/*.test.js","__snapshots__" --out-dir dist
cp -r src/component dist/es6
