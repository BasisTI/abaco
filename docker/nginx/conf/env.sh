#!/bin/bash

set -eu

sed -i 's|${ENDERECO_API}|'"$ENDERECO_API"'|' /etc/nginx/conf.d/default.conf
sed -i 's|${ENDERECO_DNS}|'"$ENDERECO_DNS"'|' /etc/nginx/conf.d/default.conf
