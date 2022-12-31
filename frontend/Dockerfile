# syntax=docker/dockerfile:1

FROM node:16.13.2-alpine AS build-stage

WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/build/ /usr/share/nginx/html
