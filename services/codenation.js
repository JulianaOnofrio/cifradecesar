const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://api.codenation.dev/v1/challenge/dev-ps'
});