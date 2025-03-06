# Redis Pub/Sub and Queue System

This project demonstrates a Redis-based submission processing system with:
- An Express server that receives submissions and pushes them to a Redis queue
- A worker process that pops submissions from the queue and processes them

## Project Structure

```
.
├── express-server/
│   └── src/
│       └── index.ts         # Express server that receives submissions
├── worker/
│   └── src/
│       └── index.ts         # Worker that processes submissions from Redis
└── README.md                # This file
```

## Redis Overview

Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker. Key features:

- **In-memory data structure store**: Provides high performance and low latency access
- **Persistence options**:
  - RDB (Redis Database File): Point-in-time snapshots of dataset
  - AOF (Append Only File): Logs every write operation for reconstruction

## Running Redis Locally

Start Redis using Docker:
```bash
docker run --name my-redis -d -p 6379:6379 redis
```

Connect to Redis CLI:
```bash
docker exec -it container_id /bin/bash
redis-cli
```

## Basic Redis Commands

### Key-Value Operations
```redis
SET mykey "Hello"     # Set a key-value pair
GET mykey             # Get value by key
DEL mykey             # Delete a key
```

### Hash Operations
```redis
HSET user:100 name "John Doe" email "user@example.com" age "30"
HGET user:100 name
HGET user:100 email
```

### Queue Operations
```redis
LPUSH problems 1      # Push to queue (left push)
LPUSH problems 2

RPOP problems         # Pop from queue (right pop)

BRPOP problems 0      # Blocking pop (waits indefinitely)
BRPOP problems 30     # Blocking pop with 30s timeout
```

## Project Setup

1. Start Redis server:
```bash
docker run --name my-redis -d -p 6379:6379 redis
```

2. Start Express server (receives submissions):
```bash
cd express-server
npm install
npm start
```

3. Start Worker (processes submissions):
```bash
cd worker
npm install
npm start
```

## How It Works

1. Submissions are sent to the Express server's `/submit` endpoint
2. The server pushes them to a Redis queue called `problems`
3. The worker continuously polls the queue using `BRPOP`
4. When a submission is received, the worker processes it

## Testing with Postman

To trigger a queue push, send a POST request to:
```
POST http://localhost:3000/submit
```

With JSON body:
```json
{
    "problemId": "123",
    "code": "function solve() { return 42; }",
    "language": "javascript"
}
```

Expected successful response:
```
Submission received and stored.
```

Note: Redis should not be used as a primary database, but works well for queues and temporary data storage.