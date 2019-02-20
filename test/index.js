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
const {
    it,
    describe,
    beforeEach,
    after,
    before
} = lab;
const { expect } = Code;

describe('hapi-redis', () => {

    before(async () => {

        const server = new Hapi.Server();
        const plugin = {
            register: Redis,
            options: { url: 'redis://127.0.0.1:6379/' }
        };

        await expect(server.register(plugin)).to.not.reject();

        internals.server = server;
    });

    beforeEach(async () => {

        await internals.server.app.redis.flushallAsync();
    });

    after(async () => {

        await internals.server.stop();

        await internals.server.app.redis.quitAsync();
    });

    it('can be added as a plugin to Hapi', () => {

        expect(internals.server.app.redis).to.exist();
        expect(internals.server.app.redis.quit).to.be.a.function();
        expect(internals.server.app.redis.quitAsync).to.be.a.function();
    });


    it('decorates the request object', async () => {

        internals.server.connection();
        internals.server.route({
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

        const response = await internals.server.inject(request);

        expect(response.result).to.equal({ success: true });
    });

    // check if is a Promise via http://www.ecma-international.org/ecma-262/6.0/#sec-promise.resolve
    it('has async methods', () => {

        const { redis } = internals.server.app;

        const testKey = 'pager:test';

        const setAsyncResult = redis.setAsync(testKey, 1);
        expect(redis.setAsync).to.be.a.function();
        expect(setAsyncResult).to.be.equal(Promise.resolve(setAsyncResult));

        const getAsyncResult = redis.getAsync(testKey);
        expect(redis.getAsync).to.be.a.function();
        expect(getAsyncResult).to.be.equal(Promise.resolve(getAsyncResult));

        const flushallAsyncResult = redis.flushallAsync();
        expect(redis.flushallAsync).to.be.a.function();
        expect(flushallAsyncResult).to.be.equal(Promise.resolve(flushallAsyncResult));

        const keysAsyncResult = redis.keysAsync(testKey);
        expect(redis.keysAsync).to.be.a.function();
        expect(keysAsyncResult).to.be.equal(Promise.resolve(keysAsyncResult));

        const ttlAsyncResult = redis.ttlAsync(testKey);
        expect(redis.ttlAsync).to.be.a.function();
        expect(ttlAsyncResult).to.be.equal(Promise.resolve(ttlAsyncResult));

        const quitAsyncResult = redis.quitAsync();
        expect(redis.quitAsync).to.be.a.function();
        expect(quitAsyncResult).to.be.equal(Promise.resolve(quitAsyncResult));
    });
});
