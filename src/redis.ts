import Redis from 'ioredis';
import {redisUri} from './env';

export const redisClient = new Redis(redisUri);
