#!/bin/bash -e

yarn install --production
../../node_modules/.bin/webpack --config ../../webpack.config.js --bail
