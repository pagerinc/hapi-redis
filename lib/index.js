'use strict';

const Redis = require('redis');

exports.register = (server, options, next) => {
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
