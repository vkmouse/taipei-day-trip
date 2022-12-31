# Taipei Day Trip
Taipei Day Trip is an E-commerce website for travel in Taipei.

[Live Demo](https://taipei-trip.ddns.net/)

![](https://github.com/vkmouse/taipei-day-trip/blob/main/docs/book_attraction.gif)
![](https://github.com/vkmouse/taipei-day-trip/blob/main/docs/user_avatar.gif)

## Table of Contents

- [Main Features](#main-features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Frontend Technique](#frontend-technique)

## Main Features

- Login is required on three of the five pages to use them.
- The member system uses JWT tokens and includes both access and refresh tokens.
- Redis is used to block attempts to refresh tokens by logged out users.
- A loading animation is displayed while data is being fetched or images are being downloaded.
- The system integrates TapPay, a payment system that supports TWD.
- A simple editor is provided for users to upload their own avatars.

## Backend Technique

### Framework

- Flask (Python)

### Infrastructure

- Docker
- docker-compose
- DNS
- NGINX
- SSL (Let's Encrypt)
- uWSGI

### Database

- MySQL

### Cache

- Redis

### Cloud Services

- EC2

### Test

- Pytest (Python)

## Architecture

<img src="https://github.com/vkmouse/taipei-day-trip/blob/main/docs/Architecture.png" width=800 />

## Database Schema

<img src="https://github.com/vkmouse/taipei-day-trip/blob/main/docs/DatabaseSchema.png" width=800 />

## Frontend Technique

### React (hook)

- SPA with functional components

### React Router

- SPA routing

### Redux (redux-toolkit)

- Manage login member infomation

### Emotion (styled component)

- Write CSS in JS
