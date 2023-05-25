import type { D1Database } from '@cloudflare/workers-types';

export const useDatabase = () => process.env.DATABASE as unknown as D1Database;
