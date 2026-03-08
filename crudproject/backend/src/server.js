// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import dbConnector from "./db.js";
import fp from "fastify-plugin";
import routes from "./routes.js";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import rateLimiter from "@fastify/rate-limit";

// Core

const fastify = Fastify({
  trustProxy: true,
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

fastify.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(sensible);
fastify.register(cookie);

// JWT

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
    sameSite: "strict", // CSRF
    path: "/",
  },
});

// Rate limiting

await fastify.register(rateLimiter, {
  max: 100,
  timeWindow: "1 minute",
});

// DB 

fastify.register(dbConnector);

// Decorators

fastify.decorate("authenticateRefresh", async function (req, reply) {
  try {
    await req.jwtVerify({ onlyCookie: true })
  } catch (err) {
    throw fastify.httpErrors.unauthorized('Invalid or expired token')
  }
  
  console.log("Refresh token verified:", req.user);
});

fastify.decorate("authenticate", async function (req, reply) {
  console.log("🐼🐼🐼 AUTHENTICATE FUNCTION RUNNING 🐼🐼🐼");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw fastify.httpErrors.unauthorized("No access token provided");
  }

  try {
      const accessToken = authHeader.split(" ")[1];
      req.user = fastify.jwt.verify(accessToken);
  } catch (err) {
      throw fastify.httpErrors.unauthorized("Invalid or expired token");
  }

  console.log("Access token verified:", req.user);
});

// Routes

fastify.register(routes);

// Error handling

fastify.setErrorHandler((err, req, reply) => {
  if (err.validation) {
    return reply.status(400).send({ error: err.message });
  }

  if (err.statusCode || err.status) {
    return reply.status(err.statusCode ?? err.status).send({ error: err.message })
  }

  // Dont expose internal errors to the client
  fastify.log.error(err);
  reply.status(500).send({ error: "Internal server error" });
});

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
