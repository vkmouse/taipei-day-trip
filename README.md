# Taipei Day Trip
Taipei Day Trip is an E-commerce website for travel in Taipei.

[Live Demo](https://taipei-trip.ddns.net/)

## Table of Contents

- [Main Features](#main-features)

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

## Database Schema

## Frontend Technique

### React (hook)

- SPA with functional components

### React Router

- SPA routing

### Redux (redux-toolkit)

- Manage login member infomation

### Emotion (styled component)

- Write CSS in JS
