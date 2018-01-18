FROM nginx:stable

COPY conf/ /conf/
COPY certificates/ /certificates/

RUN \
    # copy configurations
    cp /conf/{default.conf,gzip.conf} /etc/nginx/conf.d/ &&\
    cp /conf/{proxy.conf,env.sh} /etc/nginx/ &&\
    rm -Rf /conf &&\

    # copy letsencrypt chain
    mkdir -p /etc/nginx/ssl &&\
    mkdir -p /etc/letsencrypt/production/certs/ssl &&\
    cp ertificates/ca-bundle.crt /etc/nginx/ssl/ &&\
    rm -Rf /certificates

ADD  dist.tar.gz /usr/share/nginx/html/

CMD ["sh", "-c", "/etc/nginx/env.sh ; nginx -g 'daemon off;'"]
