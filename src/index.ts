import fastify from 'fastify';
import fastifyRedis from '@fastify/redis';
import env from '@/env.js';
import crypto from 'node:crypto';
import { FromSchema } from 'json-schema-to-ts';
import { cutOperationQSSchema } from '@/schemas/index.js';

var MAX_EXP_TIME_MINS = 100_000;

var server = fastify({ logger: true });

server.register(fastifyRedis, {
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
  port: env.REDIS_PORT,
});

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

    if (expTimeMins) {
      if (expTimeMins >= MAX_EXP_TIME_MINS) expTimeMins = MAX_EXP_TIME_MINS;
      var expTimeSecs = expTimeMins * 60;

      console.log(expTimeMins);

      await redis.expireat(storeKey, expTimeSecs);
    }

    redis.set(storeKey, originalUrl);

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
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

await bootstrap();
