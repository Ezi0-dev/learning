
async function routes (fastify, options) {
    const brands =  [ "Nvidia", "Amd" ]

    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    })

    fastify.get('/brands', async (request, reply) => {
        return brands
    })


}

export default routes