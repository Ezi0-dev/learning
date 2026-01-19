async function routes (fastify, options) {
    const brands =  [ "Nvidia", "Amd" ]

    fastify.get('/', async (req, reply) => {
        return { hello: 'world' }
    })

    fastify.get('/brands', async (req, reply) => {
        return brands
    })

    fastify.get('/note/:id', (req, reply) => {
        fastify.pg.query(
            'SELECT id, author, name, info, completed FROM notes WHERE id=$1;', [req.params.id],
            function onResult (err, result) {
                reply.send(err || result.rows)
            }
        )
    })

    fastify.get('/notes', (req, reply) => {
        fastify.pg.query(
            'SELECT * FROM notes;',
            function onResult (err, result) {
                reply.send(err || result.rows)
            }
        )
    })

    fastify.get('/users', (req, reply) => {
        fastify.pg.query(
            'SELECT * FROM users;',
            function onResult (err, result) {
                reply.send(err || result.rows)
            }
        )
    })

    fastify.post('/register', (req, reply) => {
        const ip = req.ip;
        const { username, email, password } = req.body;

        fastify.pg.query(
            'insert into users (username, email, password, ip_address) VALUES ($1, $2, $3, $4);', [username, email, password, ip],
            function onResult (err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.post('/login', async (req, reply) => {
        const { username, password } = req.body;

        try {
            const { rows } = await fastify.pg.query(
                'SELECT id, username, email, password, ip_address FROM users WHERE username = $1;', [username]
            );

            const user = rows[0];

            if (password !== user.password) {
                reply.status(401).send({ error: "Invalid username or password" });
            }




            //console.log(rows[0]);

        } catch (err)  {
            reply.status(500).send({ error: err.message });
        }
    })

}
export default routes