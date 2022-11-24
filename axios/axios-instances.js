const axios = require("axios");
const Agent = require("agentkeepalive");

function createHttpAgent() {
  return new Agent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  });
}

function createHttpsAgent() {
  return new Agent.HttpsAgent({
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  });
}

const axiosInstance = axios.create({ httpAgent: createHttpAgent() });

module.exports = {
  axiosInstance,
}
