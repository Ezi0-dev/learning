
import fastifyPlugin from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'
import dotenv from "dotenv"

async function dbConnector (fastify, options) {
    fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL
    })

    fastify.addHook('onClose', async (instance) => {
        await instance.pg.pool.end()
    })
}

export default fastifyPlugin(dbConnector)