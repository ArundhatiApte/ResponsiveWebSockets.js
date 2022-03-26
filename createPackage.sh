#!/bin/sh

rm ResponsiveWebSockets.package.zip

zip -r ResponsiveWebSockets.package.zip . \
  -x node_modules/\*\
  -x docs/\*\
  -x .git/\*\
  -x examples/\*\
  -x *test\*\
  -x ".gitignore"\
  -x *test/\*\
  -x "createPackage.sh"
