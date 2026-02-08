// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import dbConnector from './db.js'
import fp from 'fastify-plugin'
import testRoute from './testRoute.js'
import fastifyFormbody from '@fastify/formbody'
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

fastify.register(fastifyFormbody);
fastify.register(cookie);
fastify.register(jwt, { secret: process.env.JWT_SECRET, 
  cookie: {
  cookieName: 'refreshToken',
  signed: false
  }   
});
 

fastify.decorate('authenticate', async function(req, reply) {
    try {

        console.log("🐼🐼🐼 AUTHENTICATE FUNCTION RUNNING 🐼🐼🐼")

        //console.log(req.cookies)

        await req.jwtVerify()

        //console.log(req.user, "RefreshToken authenticated successfully")

    } catch (err) {
        console.log(err)
    }
})

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