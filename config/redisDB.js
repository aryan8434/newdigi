const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_KEY,
  socket: {
    host: "redis-15798.c232.us-east-1-2.ec2.cloud.redislabs.com",
    port: 15798,
    connectTimeout: 10000,
  },
});

redisClient.on("error", (error) => {
  console.error("Redis client error:", error.message);
});

redisClient.on("reconnecting", () => {
  console.warn("Redis client reconnecting...");
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
});

module.exports = redisClient;
