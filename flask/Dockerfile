# syntax=docker/dockerfile:1

FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY config.json.template config.json
COPY . .

EXPOSE 3000

CMD [ "python", "app.py" ]
