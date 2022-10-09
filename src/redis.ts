import Redis from 'ioredis';
import {redisUri} from './env';

export const client = new Redis(redisUri);
