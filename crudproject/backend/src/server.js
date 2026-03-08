// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import dbConnector from "./db.js";
import fp from "fastify-plugin";
import testRoute from "./testRoute.js";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import sensible from "@fastify/sensible"
import rateLimiter from "@fastify/rate-limit"

const fastify = Fastify({
  trustProxy: true,
  logger: {
    transport: {
      target: 'pino-pretty'
    }
  }
});

fastify.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(sensible)
fastify.register(cookie);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
    sameSite: 'strict', // CSRF
    path: '/'
  },
});

await fastify.register(rateLimiter, {
  max: 5,
  timeWindow: '1 minute'
})

fastify.decorate("authenticateRefresh", async function (req, reply) {
  await req.jwtVerify();
  console.log("Refresh token verified:", req.user);
});

fastify.decorate("authenticate", async function (req, reply) {
  console.log("🐼🐼🐼 AUTHENTICATE FUNCTION RUNNING 🐼🐼🐼");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No access token provided" });
  }

  const accessToken = authHeader.split(" ")[1];

  const decoded = fastify.jwt.verify(accessToken);
  req.user = decoded;

  console.log("Access token verified:", req.user);
});

fastify.register(dbConnector);
fastify.register(testRoute);

fastify.setErrorHandler((err, req, reply)=> {
  if (err.validation) {
    return reply.status(400).send({ error: err.message })
  }

  if (err.statusCode) {
    return reply.status(err.statusCode).send({ error: err.message })
  }

  // Dont expose internal errors to the client
  fastify.log.error(err)
  reply.status(500).send({ error: 'Internal server error' })
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
