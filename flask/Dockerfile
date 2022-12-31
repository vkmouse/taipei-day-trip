# syntax=docker/dockerfile:1

FROM python:3.10-alpine3.17 as base
FROM base as builder
COPY requirements.txt /requirements.txt
RUN pip install --user -r /requirements.txt

FROM base
WORKDIR /app

COPY . .
COPY --from=builder /root/.local /root/.local
RUN apk add uwsgi-python3

ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=000000
ENV MYSQL_HOST=tdt-mysql
ENV MYSQL_DATABASE=taipei_day_trip
ENV JWT_SECRET_KEY=000000
ENV JWT_ACCESS_TOKEN_LIFETIME=900
ENV JWT_REFRESH_TOKEN_LIFETIME=604800
ENV REDIS_HOST=tdt-redis
ENV REDIS_PORT=6379
ENV TAPPAY_PAY_BY_PRIME_URL=
ENV TAPPAY_PARTNER_KEY=
ENV TAPPAY_MERCHANT_ID=
EXPOSE 3000

CMD [ "uwsgi", "--ini" , "uwsgi.ini"]
