async function routes (fastify, options) {
    const brands =  [ "Nvidia", "Amd" ]

    fastify.get('/', async (req, reply) => {
        return { hello: 'world' }
    })

    fastify.get('/brands', async (req, reply) => {
        return brands
    })

    fastify.get('/notes/:id', (req, reply) => {
        fastify.pg.query(
            'SELECT id, author, name, info, completed FROM notes WHERE id=$1;', [req.params.id],
            function onResult (err, result) {
                reply.send(err || result.rows)
            }
        )
    })

    fastify.get('/note', (req, reply) => {
        fastify.pg.query(
            'SELECT * FROM notes;',
            function onResult (err, result) {
                reply.send(err || result.rows)
            }
        )
    })

}

export default routes