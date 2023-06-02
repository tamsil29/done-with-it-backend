const { redisClient } = require("../start/redis");

// function getOrSetCache(key, cb) {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, async (error, data) => {
//       if (error) return reject(error);
//       if (data != null) return resolve(JSON.parse(data));
//       const freshData = await cb();
//       redisClient.set(key, JSON.stringify(freshData));
//       resolve(freshData);
//     });
//   });
// }

function setCache(key, value) {
  redisClient.set(key, JSON.stringify(value));
}

async function getCache(key) {
  try {
    const value = await redisClient.get(key);
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    return "";
  }
}

function clearCache(key) {
  redisClient.del(key);
}

async function clearAllCache() {
  return redisClient.flushall((error, success) => {
    if (error) console.log(error);
    if (success) console.log(success);
  });
}

module.exports = { setCache, getCache, clearCache, clearAllCache };
