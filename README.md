# hapi-redis

  A [node-redis] hapi plugin

[![Build Status](https://travis-ci.org/pagerinc/hapi-redis.svg?branch=master)](https://travis-ci.org/pagerinc/hapi-redis)

## Installation

```
npm install --save @pager/hapi-redis
```

## Quick start

This pretty much works as a regular node-redis client, with the addition of providing an easily accessible instance via the [`server.app`](http://hapijs.com/api#serverapp) common namespace.

## Examples

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ host: 'localhost' });

const options = {
    // node-redis config options - http://redis.js.org/#api-rediscreateclient
};

// Register the plugin
server.register({
    register: require('@pager/hapi-redis'),
    options: options
}, (err) => {

    if (err) {
        console.error(err);
    } 
    else {
        server.start(() => {

            console.info(`Server started at ${server.info.uri}`);
        });
    }
});

// Declare a route that uses it
server.route({
    method: 'GET',
    path: '/stats',
    handler: usersHandler
});

usersHandler (request, reply) => {

    // Access the redis instance
    const client = request.redis;
    client.hgetall('users', (err, obj) => {
    
        if (err) {
            throw err
        }

        return reply({ result: obj });
    });
};

server.start(() => {
    console.log(`Server started at ${server.info.uri}`);
});
```

## Async support
You could use next promisified methods (e.g. `const res = await getAsync(key);`)
| Original method | Promisified method |
| --------------- | ------------------ |
| set             | setAsync           |
| get             | getAsync           |
| flushall        | flushallAsync      |
| quit            | quitAsync          |
| keys            | keysAsync          |
| ttl             | ttlAsync           |

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Acknowledgements

This module borrows heavily from [hapi-ioredis].

[node-redis]: https://github.com/NodeRedis/node_redis
[hapi-ioredis]: https://github.com/cilindrox/hapi-ioredis
