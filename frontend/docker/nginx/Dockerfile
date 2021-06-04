FROM node:10-alpine as builder
COPY package.json package-lock.json ./
RUN npm ci --registry http://element.basis.com.br/repository/npm-registry/ && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN npm run ng build -- --output-path=dist

FROM nginx:stable
COPY --from=builder /ng-app/dist /usr/share/nginx/html
COPY docker/nginx/conf/ /conf/
COPY docker/nginx/certificates/ /certificates/
RUN \
    cp /conf/default.conf /conf/gzip.conf /etc/nginx/conf.d/ &&\
    cp /conf/proxy.conf /conf/env.sh /etc/nginx/ &&\
    rm -Rf /conf &&\
    mkdir -p /etc/nginx/ssl &&\
    mkdir -p /etc/letsencrypt/production/certs/ssl &&\
    cp certificates/ca-bundle.crt /etc/nginx/ssl/ &&\
    rm -Rf /certificates
CMD ["sh", "-c", "/etc/nginx/env.sh ; nginx -g 'daemon off;'"]

