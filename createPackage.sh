#!/bin/sh

rm ResponsiveWebSockets.package.tar.gz

tar -czvf ResponsiveWebSockets.package.tar.gz \
  --exclude='node_modules'\
  --exclude='docs'\
  --exclude='.git'\
  --exclude='examples'\
  --exclude=".gitignore"\
  --exclude='*test*'\
  --exclude='*tests.js'\
  --exclude='createPackage.sh'\
  .
