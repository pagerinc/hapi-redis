'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Redis = require('../');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const { it } = lab;
const { expect } = Code;

it('can be added as a plugin to Hapi', async () => {

    const server = new Hapi.Server();
    const plugin = {
        register: Redis,
        options: { url: 'redis://127.0.0.1:6379/' }
    };

    await expect(server.register(plugin)).to.not.reject();

    expect(server.app.redis).to.exist();
    expect(server.app.redis.quit).to.be.a.function();
});


it('decorates the request object', async () => {

    const server = new Hapi.Server();
    const plugin = {
        register: Redis,
        options: {}
    };

    await expect(server.register(plugin)).to.not.reject();

    server.connection();
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {

            expect(request.redis).to.exist();
            expect(request.redis.quit).to.be.a.function();
            return reply({ success: true });
        }
    });

    const request = {
        method: 'GET',
        url: '/'
    };

    const response = await server.inject(request);

    expect(response.result).to.equal({ success: true });
});

