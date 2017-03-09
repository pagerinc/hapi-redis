'use strict';

const Redis = require('redis');
const bluebird = require('bluebird');

exports.register = (server, options, next) => {
  if (options.promisify === true) {
    bluebird.promisifyAll(Redis.RedisClient.prototype);
    bluebird.promisifyAll(Redis.Multi.prototype);
    delete options.promisify;
  }

  const client = Redis.createClient(options);

  server.app.redis = client;
  server.decorate('request', 'redis', client);

  client.on('connect', () => {
    server.log(['info', 'hapi-redis'], 'connected to redis');
    return next();
  });
};

exports.register.attributes = {
  pkg: require('../package.json'),
  multiple: true
};
