import 'dotenv/config'
import argon2 from 'argon2'
import schemas from './modules/schemas.js'

async function routes (fastify, options) {

    fastify.get('/', async (req, reply) => {
        console.log()
        fastify.authenticate(req)
        return { hello: 'world' }
    })

    fastify.post('/logout', { onRequest: [fastify.authenticateRefresh] }, async (req, reply) => {
        reply.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        // Also delete when users refreshToken expires !

        await fastify.pg.query(
            'DELETE FROM sessions WHERE user_id = $1', [req.user.id]
        );

        reply.status(201).send({ message: 'Logout successful!' })
    })

    fastify.get('/notes', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        const result = await fastify.pg.query('SELECT id, "user", title, content FROM notes WHERE "user" = $1 AND deleted_at IS NULL;', 
            [req.user.username]
        )

        reply.status(201).send(result.rows)
    })

    fastify.post('/register', { schema: schemas.register }, async (req, reply) => {
        const ip = req.ip;
        const { username, email, password } = req.body;

        const password_hash = await argon2.hash(password)

        await fastify.pg.query('INSERT INTO users (username, email, password, ip_address) VALUES ($1, $2, $3, $4);', [username, email, password_hash, ip])

        reply.status(201).send({ message: "User registered successfully!" })
        fastify.log.info(`User registered: ${username} ${email}`)
    })

    fastify.post('/refresh', { onRequest: [fastify.authenticateRefresh] }, async (req, reply) => {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return reply.code(401).send({ error: 'No refresh token provided' })
        }

        // Authenticates the refreshToken

        const result = await fastify.pg.query('SELECT id, username, email FROM users WHERE id = $1;', [req.user.id])

        const user = result.rows[0]
            
        console.log("! 👻 REFRESH ROUTE IN USE 👻 !")

        // New token gets generated
        const accessToken = fastify.jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            { expiresIn: process.env.ACCESS_TOKEN_EXP}
        );

        return reply.status(201).send({
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    })

    fastify.put('/notes/:id', { onRequest: [fastify.authenticate], schema: schemas.updateNoteSchema }, async (req, reply) => {
        console.log("this is the params", req.params)
        const { title, content } = req.body
        const { id } = req.params

        const { rows } = await fastify.pg.query('UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND "user" = $4 RETURNING *;', 
            [title, content, id, req.user.username]
        )

        if (!rows[0]) throw fastify.httpErrors.notFound('Note not found')
            
        reply.status(200).send(rows[0])
    })

    fastify.post('/notes', { onRequest: [fastify.authenticate], schema: schemas.noteSchema }, async (req, reply) => {
        const { title, content } = req.body
        const user = req.user.username

        const { rows } = await fastify.pg.query(
            'SELECT COUNT(*) FROM notes WHERE "user" = $1 AND deleted_at IS NULL', 
            [user]
        )

        if (parseInt(rows[0].count) >= 10) {
            throw fastify.httpErrors.forbidden('Note limit reached')
        }

        await fastify.pg.query(
            'INSERT INTO notes ("user", title, content) VALUES ($1, $2, $3);',
            [user, title, content]
        )
        
        reply.status(201).send({ message: 'Note created successfully' })
    })

    fastify.delete('/notes/:id', { onRequest: [fastify.authenticate], schema: schemas.deleteNoteSchema }, async (req, reply) => {
        const id = req.params.id

        console.log(req.body)

        console.log("id", id)

        await fastify.pg.query('UPDATE notes SET deleted_at = NOW() WHERE id = $1 AND "user" = $2 RETURNING id;', [id, req.user.username]);

        reply.status(201).send({ message: 'Note deleted successfully' })
    })

    fastify.post('/login', { schema: schemas.login }, async (req, reply) => {
        const { username, password } = req.body;

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

            await fastify.pg.query(
                `INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')`, [user.id, refreshToken]
            );
            
            reply
                .setCookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                .status(201).send({
                    message: 'Logged in successfully',
                    user: { id: user.id, username: user.username, email: user.email },
                    accessToken
                });
        } else {
            reply.status(401).send({ error: "Invalid username or password" });
        }
    })
}

export default routes