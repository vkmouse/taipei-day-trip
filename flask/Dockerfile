# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

RUN apt-get update && \
    apt-get -y install gcc
RUN pip3 install uwsgi

WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=000000
ENV MYSQL_HOST=tdt-mysql
ENV MYSQL_DATABASE=taipei_day_trip
ENV JWT_SECRET_KEY=000000
ENV JWT_ACCESS_TOKEN_LIFETIME=900
ENV JWT_REFRESH_TOKEN_LIFETIME=604800
ENV REDIS_HOST=tdt-redis
ENV REDIS_PORT=6379
EXPOSE 3000

CMD [ "uwsgi", "--ini" , "uwsgi.ini"]
