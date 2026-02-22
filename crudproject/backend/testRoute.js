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

    fastify.post('/logout', async (req, reply) => {
        try {
            reply.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            reply.send({ message: 'Logout successful!' })
        } catch (err) {
            reply.status(500).send({ error: 'Logout failed' })
        }
    })

    fastify.get('/notes', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const result = await fastify.pg.query('SELECT id, "user", title, content FROM notes WHERE "user" = $1;', [req.user.username])

            reply.send(result.rows)
        } catch (err) {
            reply.status(500).send({ error: err.message })
        }
    })

    fastify.get('/allnotes', (req, reply) => {
        try {
            const result = fastify.pg.query('SELECT * FROM notes;')
                        
            reply.send(result.rows)
        } catch (err) {
            reply.status(500).send({ error: err.message })
        }
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

            await fastify.pg.query('INSERT INTO users (username, email, password, ip_address) VALUES ($1, $2, $3, $4);', [username, email, password_hash, ip])

            reply.send({ message: "User registered successfully!" })
        } catch (err) {
            console.log(err);
        }
    })

    fastify.post('/refresh', { onRequest: [fastify.authenticateRefresh] }, async (req, reply) => {
        const refreshToken = req.cookies.refreshToken

        console.log(req.cookies)

        if (!refreshToken) {
            return reply.code(401).send({ error: 'No refresh token provided' })
        }

        try {
            // Authenticates the refreshToken

            const result = await fastify.pg.query('SELECT id, username, email FROM users WHERE id = $1;', [req.user.id])

            const user = result.rows[0]
                
            console.log("! /REFRESH ROUTE IN USE !")

            // New token gets generated
            const accessToken = fastify.jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                { expiresIn: process.env.ACCESS_TOKEN_EXP}
            );

            return reply.send({
                accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (err) {
            console.log(err)
            return reply.code(401).send({ error: 'Invalid refresh token' })
        }
    })

    fastify.get('/me', async (req, reply) => {
        const authHeader = req.headers.authorization

        const token = authHeader.replace('Bearer', '')

        console.log("/me route token is : ", token)

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            reply.send({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username
                }
            })
        } catch (err) {
            return reply.code(401).reply.send({ error: 'Invalid token' })
        }
        
    }) 

    fastify.put('/notes', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const { id, title, content } = req.body

        try {
            await fastify.pg.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3;', [title, content, id])
            
            reply.send({ message: "Note updated successfully!" })
        } catch(err) {
            reply.send(err)
            console.log(err)
        }
    })

    fastify.post('/notes', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const { user, title, content } = req.body

        try {
            await fastify.pg.query('INSERT INTO notes ("user", title, content) VALUES ($1, $2, $3);', [user, title, content])
            
            reply.send({ message: "Note created successfully!" })
        } catch(err) {
            reply.send(err)
            console.log(err)
        }
    })

    fastify.delete('/notes/:id', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const id = req.params.id

        console.log("id", id)

        try {
            await fastify.pg.query('UPDATE notes SET deleted_at = NOW() WHERE id = $1;', [id]);
            reply.send({ message: 'Note Removed!' })
        } catch (err) {
            console.log(err)
        }
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
                    { id: user.id, username: user.username, email: user.email },
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