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

EXPOSE 3000

CMD [ "uwsgi", "--ini" , "uwsgi.ini"]
