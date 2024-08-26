# Node.js API Cluster with Rate Limiting and Task Queueing

## Overview
This project implements a Node.js API cluster with two replica sets, rate limiting, and a task queueing system. The API processes tasks with a rate limit of 1 task per second and 20 tasks per minute per user ID. Requests exceeding the rate limit are queued and processed according to the defined limits.

## Features
- Node.js cluster with two replica sets for parallel processing.
- User-based rate limiting to control task submission.
- Redis-backed task queue to manage and process tasks.
- Logging of task completion with user ID and timestamp.

## Requirements
- Node.js
- Redis

## Installation

1. Clone the repository
2. Install dependencies:
