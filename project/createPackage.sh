#!/bin/sh

rm ResponsiveWebSockets.package.tar.gz

tar -czvf ResponsiveWebSockets.package.tar.gz \
  --transform='s,^,package/,'\
  --exclude='test*'\
  ./../LICENCE package.json ./../README.md src
