FROM node:12.13.0-alpine as builder
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build:production
COPY ./ ./

FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY ./environment/production/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/angularmaterial /usr/share/nginx/html
