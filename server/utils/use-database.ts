import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';

export const useDatabase = (event: H3Event) => event.context.cloudflare.env.DATABASE as D1Database;
