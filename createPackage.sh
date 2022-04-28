#!/bin/sh

rm ResponsiveWebSockets.package.tar.gz

tar -czvf ResponsiveWebSockets.package.tar.gz \
  --exclude='test*'\
  --exclude='tests.js'\
  LICENCE package.json README.md src
