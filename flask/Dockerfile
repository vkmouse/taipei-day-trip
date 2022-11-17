# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=000000
ENV MYSQL_HOST=tdt-mysql
ENV MYSQL_DATABASE=taipei_day_trip
EXPOSE 3000

CMD [ "python", "app.py" ]
