const redis = require("redis");
const { getClient } = require("../daos/impl/redis/redis_client");
export default class RatelimitDAO {
  // Generate Radis key by ip
  _getKey(ip) {
    return `ratelimit:${ip}`;
  }

  /**
   * আইপি-র রিকোয়েস্ট সংখ্যা চেক এবং আপডেট করার মেথড
   * @param {string} ip - ইউজারের আইপি অ্যাড্রেস
   * @param {number} windowInSeconds - কত সময়ের উইন্ডো (যেমন: ৬০ সেকেন্ড)
   * @returns {Promise<number>} - বর্তমান উইন্ডোতে এই আইপির মোট রিকোয়েস্ট সংখ্যা
   */
  async incrementAndHits(ip, windowInSeconds = 60) {
    const redisClient = getClient();
    // Get key
    const clientKey = this._getKey(ip);

    // ১. এই আইপির রিকোয়েস্ট কাউন্ট ১ বাড়িয়ে দেবে। কী না থাকলে নতুন তৈরি করে ১ সেট করবে।
    const currentHits = await redisClient.incr(key);

    // ২. যদি এটি প্রথম রিকোয়েস্ট হয় (অর্থাৎ কাউন্ট ১), তবে এই কী-এর জন্য এক্সপায়ারি টাইম সেট হবে
    if (currentHits === 1) {
      await redisClient.expire(key, windowInSeconds);
    }

    return currentHits;
  }
}
