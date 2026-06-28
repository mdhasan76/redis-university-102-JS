const redis = require("redis");
const { promisify } = require("util");

// Create a client and connect to Redis;
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// Use Node's built in promisify to wrap the Redis
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Chain promises together to call Redis commands and
// Process the results.
setAsync("product:2", "iPhone 14")
  .then((res) => console.log(res))
  .then(() => getAsync("product:2"))
  .then((res) => console.log("Response of Get:", res))
  .then(() => client.quit());
