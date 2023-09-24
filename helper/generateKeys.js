//code to generate new keys for crypto

const crypto = require('crypto');
const key = crypto.randomBytes(32).toString('hex');
console.log(key);

module.exports = key;