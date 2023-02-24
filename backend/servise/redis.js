const Redis = require("ioredis");


const redis = new Redis({
  port: 10314,
  host: "redis-10314.c305.ap-south-1-1.ec2.cloud.redislabs.com",
  username: "default", // needs Redis >= 6
  password: "eyCxn7NjGqKoeJT8lTwC4wn0UKt16lvf",
  db: 0, // Defaults to 0
})


module.exports = { redis }