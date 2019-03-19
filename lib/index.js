'use strict';

const { promisify } = require('util');
const Redis = require('redis');

// Declare internals

const internals = {};

module.exports = {
    pkg: require('../package'),
    register: (server, options) => {

        const client = Redis.createClient(options);

        const methodsToAsync = [
            'set',
            'get',
            'flushall',
            'quit',
            'keys',
            'ttl'
        ];

        methodsToAsync.reduce((instance, method) => {

            instance[`${method}Async`] = promisify(instance[method]).bind(instance);
            return instance;
        }, client);

        server.app.redis = client;
        server.decorate('request', 'redis', client);

        client.on('connect', () => {

            server.log(['info', 'hapi-redis'], 'connected to redis');
        });
    }
};
