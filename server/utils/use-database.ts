import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';

export const useDatabase = () => process.env.DATABASE as unknown as D1Database;
