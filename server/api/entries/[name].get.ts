import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { RawEntry } from '../../utils/transform-entry';

export default defineEventHandler((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	try {
		return await db
			.prepare('SELECT name, url, avatars, boxes FROM templates WHERE name = ?')
			.bind(decodeURIComponent(event.context.params!.name))
			.first<RawEntry>()
			.then(transformTemplateEntry);
	} catch (error) {
		if (error instanceof Error) error = (error.cause as Error)?.message ?? error.message;
		throw createError({
			statusCode: 404,
			statusMessage: String(error ?? 'Received an unknown error')
		});
	}
}
