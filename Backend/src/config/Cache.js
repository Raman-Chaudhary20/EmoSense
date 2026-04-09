const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASSWORD,
  family:4
});

redis.on("connect", () => {
  console.log("Server is connected to redis.");
});

module.exports = redis;
