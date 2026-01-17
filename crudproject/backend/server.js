// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import dbConnector from './db.js'
import testRoute from './testRoute.js'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

fastify.register(cors)
fastify.register(dbConnector)
fastify.register(testRoute)

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})