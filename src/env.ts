import * as env from 'env-var';

export const portWebsocket = env.get('PORT').default(3000).asPortNumber();
export const redisUri = env.get('REDIS_URI').required(true).asString();
