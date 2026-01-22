// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import dbConnector from './db.js'
import testRoute from './testRoute.js'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv'

const fastify = Fastify({
  trustProxy: true,
  logger: true
});

fastify.register(cors, { 
  origin: 'http://localhost:5173',
  credentials: true
});

fastify.register(cookie);
fastify.register(jwt, { secret: process.env.JWT_SECRET });

fastify.register(dbConnector);
fastify.register(testRoute);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})