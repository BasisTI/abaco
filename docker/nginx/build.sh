#!/bin/sh

set -eu

npm install
#npm run build -- --prod
npm run build

cd dist
tar zcvf dist.tar.gz *
mv dist.tar.gz ../docker/nginx/

cd ../docker/nginx
chmod -R a+x *.sh
