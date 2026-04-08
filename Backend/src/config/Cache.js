const Redis = require("ioredis");


console.log("PORT RAW:", process.env.REDIS_PORT);
console.log("PORT TYPE:", typeof process.env.REDIS_PORT);
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
