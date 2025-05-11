import fastify from 'fastify';
import fastifyRedis from '@fastify/redis';
import fastifyStatic from '@fastify/static';
import crypto from 'node:crypto';
import path from 'node:path';
import { FromSchema } from 'json-schema-to-ts';
import { cutOperationQSSchema } from '@/schemas/index.js';
import env from '@/env.js';

var server = fastify({ logger: true });

server.register(fastifyRedis, {
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: env.REDIS_PORT,
});

server.register(fastifyStatic, {
  root: path.join(import.meta.dirname, '../public'),
  wildcard: true,
});

server.get('/', (req, reply) => reply.sendFile('index.html'));

server.get<{ Querystring: FromSchema<typeof cutOperationQSSchema> }>(
  '/cut',
  { schema: { querystring: cutOperationQSSchema } },
  async (req, reply) => {
    var { u: originalUrl, e: expTimeMins, n: nameUrl } = req.query;
    var { redis } = server;
    var storeKey = nameUrl
      ? `${env.APP_NAME}:${nameUrl}`
      : `${env.APP_NAME}:${crypto.randomBytes(6).toString('base64url')}`;

    if (nameUrl) {
      if (await redis.exists(storeKey)) {
        return reply.status(400).send({ message: 'URL with this name already exist.' });
      }
    }

    await redis.set(storeKey, originalUrl);

    if (expTimeMins) await redis.expire(storeKey, expTimeMins * 60);

    return reply.status(200).send(`${req.protocol}://${req.host}/${storeKey.split(':').at(-1)}`);
  }
);

server.get<{ Params: { name: string } }>('/:name', async (req, reply) => {
  var { name } = req.params;
  var { redis } = server;
  var originalUrl = await redis.get(`${env.APP_NAME}:${name}`);

  if (!originalUrl) return reply.status(404).send({ message: 'Cannot find an URL.' });

  return reply.redirect(originalUrl);
});

async function bootstrap() {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

await bootstrap();
