const redis = require('./redis_client');
/* eslint-disable no-unused-vars */
const keyGenerator = require('./redis_key_generator');
const timeUtils = require('../../../utils/time_utils');
/* eslint-enable */

/* eslint-disable no-unused-vars */

// Challenge 7
const hitSlidingWindow = async (name, opts) => {
  const client = redis.getClient();

  // START Challenge #7
  const key = keyGenerator.getKey(`limiter:${name}:${opts.interval}:${opts.maxHits}`);
  const now = timeUtils.getCurrentTimestampMillis();
  const tx = client.multi();

  // 1. new entry in sotred set
  tx.zadd(key, now, `${now}-${Math.random()}`);

  // 2. Remove entries older than the interval
  tx.zremrangebyscore(key, 0, now - opts.interval)

  // 3. get current number of hits
  tx.zcard(key);

  const result= await tx.execAsync();
  const hits = result[2];
  let hitsRemaining;
  if(hits > opts.maxHits ){
    hitsRemaining = -1;
  }else{
    hitsRemaining = opts.maxHits - hits;
  }
  return hitsRemaining;
  // END Challenge #7
};

/* eslint-enable */

module.exports = {
  /**
   * Record a hit against a unique resource that is being
   * rate limited.  Will return 0 when the resource has hit
   * the rate limit.
   * @param {string} name - the unique name of the resource.
   * @param {Object} opts - object containing interval and maxHits details:
   *   {
   *     interval: 1,
   *     maxHits: 5
   *   }
   * @returns {Promise} - Promise that resolves to number of hits remaining,
   *   or 0 if the rate limit has been exceeded..
   */
  hit: hitSlidingWindow,
};
