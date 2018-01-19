#!/bin/sh

set -eu

docker container run \
    --name build-abaco \
    -it \
    --rm \
    -u $UID:$UID \
    -v $(pwd):/var/lib/jenkins/workspace \
    -w /var/lib/jenkins/workspace \
    basis-registry.basis.com.br/basis/builder-image:node-8.9.3 \
    sh -c 'docker/nginx/build.sh'