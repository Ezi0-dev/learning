
import fastifyPlugin from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

async function dbConnector (fastify, options) {
    fastify.register(fastifyPostgres, {
        connectionString: 'postgres://postgres:password@localhost/crudproject'
    })
}

export default fastifyPlugin(dbConnector)