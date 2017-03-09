'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Redis = require('../');
const lab = exports.lab = Lab.script();
const it = lab.it;
const expect = Code.expect;

it('can be added as a plugin to Hapi', (done) => {
  const server = new Hapi.Server();
  const plugin = {
    register: Redis,
    options: { url: 'redis://127.0.0.1:6379/' }
  };

  server.register(plugin, (err) => {
    expect(err).to.not.exist();
    expect(server.app.redis).to.exist();
    expect(server.app.redis.quit).to.be.a.function();
    done();
  });
});

it('decorates the request object', (done) => {
  const server = new Hapi.Server();
  const plugin = {
    register: Redis,
    options: {}
  };

  server.register(plugin, (err) => {
    expect(err).to.not.exist();
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

    server.inject(request, (res) => {
      expect(res.result).to.equal({ success: true });
      done();
    });
  });
});
