import 'dotenv/config'
import argon2 from 'argon2'

async function routes (fastify, options) {
    const brands =  [ "Nvidia", "Amd" ]

    fastify.get('/', async (req, reply) => {
        console.log()
        fastify.authenticate(req)
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

    fastify.post('/register', async (req, reply) => {
        const ip = req.ip;
        const { username, email, password } = req.body;

        try {
            const password_hash = await argon2.hash(password)

            fastify.pg.query(
                'insert into users (username, email, password, ip_address) VALUES ($1, $2, $3, $4);', [username, email, password_hash, ip],
                function onResult (err, result) {
                    reply.send(err || result)
                }
            )

            

        } catch (err) {
            console.log(err);
        }
    })

    fastify.get('/me', async (req, reply) => {


        fastify.authenticate(req)
        
    }) 

    fastify.post('/login', async (req, reply) => {
        const { username, password } = req.body;

        try {
            const { rows } = await fastify.pg.query(
                'SELECT id, username, email, password, ip_address FROM users WHERE username = $1;', [username]
            );

            const user = rows[0];

            if (await argon2.verify(user.password, password)) {
                console.log("Success password match !!! 🐼🐼👻👻");

                const accessToken = fastify.jwt.sign(
                    { id: user.id, email: user.email },
                    { expiresIn: process.env.ACCESS_TOKEN_EXP}
                );

                const refreshToken = fastify.jwt.sign(
                    { id: user.id, },
                    { expiresIn: process.env.REFRESH_TOKEN_EXP}
                );
                
                reply
                    .setCookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    })
                    .send({
                        message: 'Logged in successfully',
                        user: { id: user.id, username: user.username, email: user.email },
                        accessToken
                    });
            } else {
                reply.status(401).send({ error: "Invalid username or password" });
            }

            
            //console.log(rows[0]);

        } catch (err)  {
            reply.status(500).send({ error: err.message });
        }
    })

}

export default routes