export default {
  APP_NAME: process.env.APP_NAME || 'lessurl',
  REDIS_HOST: process.env.REDIS_HOST || 'redis.yarkov.tech',
  REDIS_PORT: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
};
