const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis);

const runApplication = async () => {
  // connect to redis
  const client = redis.createClient({
    host: "localhost",
    port: 6379,
  });

  // run redis command
  const reply = await client.setAsync("hello", "world");

  const getValue = await client.getAsync("hello");
  console.log("Get Value", getValue);

  // quite
  client.quit();
};

// const runApplicationModernNode = async () => {
//   const client = redis.createClient({
//     port: 6379,
//     host: "localhost",
//   });

//   client.on("error", (err) => console.log("Redis client connection err", err));

//   await client.connect();

//   await client.set("hello", "world");

//   const getValue = await client.get("hello");
//   console.log(getValue);

//   await client.quit();
// };

try {
  runApplication();
  //   runApplicationModernNode();
} catch (err) {
  console.log(err);
}
