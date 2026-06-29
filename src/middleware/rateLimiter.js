const { default: RatelimitDAO } = require("../utils/rateLimiteDAO");

const rateLimitDAO = new RatelimitDAO();
function rateLimiter(maxHits = 10, windowInSeconds = 60) {
  return async (req, res, next) => {
    // take user ip address
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    try {
      // Know how much time the ip call the api from DAO
      const hits = rateLimitDAO.incrementAndHits(ip, windowInSeconds);

      // Set Headers current and remaining limit
      set.headers["X-RateLimit-Limit"] = maxHits;
      set.headers["X-RateLimit-Remaining"] = Math.max(0, maxHits - hits);

      // Check if hits max limit
      if (hits > maxHits) {
        return res.status(429).json({
          success: false,
          message: `Too many requests! Please try again after ${windowInSeconds} seconds.`,
        });
      }

      // Call next() if pass everything here
      next();
    } catch (err) {
      // Redis ডাউন থাকলেও যেন আপনার মেইন অ্যাপ ক্র্যাশ না করে, তাই next() কল করা ভালো
      console.error("Rate Limiter Error:", error);
      next();
    }
  };
}
