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

const fastify = Fastify({
  trustProxy: true,
  logger: true,
});

fastify.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.register(cookie);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

fastify.decorate("authenticateRefresh", async function (req, reply) {
  try {
    await req.jwtVerify();
    console.log("Refresh token verified:", req.user);
  } catch (err) {
    return reply.status(401).send({ error: "Invalid refresh token" });
  }
});

fastify.decorate("authenticate", async function (req, reply) {
  try {
    console.log("🐼🐼🐼 AUTHENTICATE FUNCTION RUNNING 🐼🐼🐼");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No access token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    const decoded = fastify.jwt.verify(accessToken);
    req.user = decoded;

    console.log("Access token verified:", req.user);
  } catch (err) {
    console.log("Auth error:", err.message);
    return reply.status(401).send({ error: "Invalid access token" });
  }
});

fastify.register(dbConnector);
fastify.register(testRoute);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
