import type { D1Database, D1Result } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { RawEntry } from '../../utils/transform-entry';

export default defineEventHandler((event) => {
	const db = useDatabase();
	return db ? handleEvent(db) : fallbackHandleEvent(event);
});

async function handleEvent(db: D1Database) {
	let result: D1Result<RawEntry>;
	try {
		result = await db.prepare('SELECT name, url, avatars, boxes FROM templates ORDER BY uses DESC LIMIT 25').all<RawEntry>();
		if (result.success) return result.results!.map(transformTemplateEntry);
	} catch (error) {
		if (error instanceof Error) error = (error.cause as Error)?.message ?? error.message;
		throw createError({
			statusCode: 500,
			statusMessage: String(error ?? 'Received an unknown error')
		});
	}

	throw createError({
		statusCode: 500,
		statusMessage: result.error ?? 'Received an unknown error'
	});
}

async function fallbackHandleEvent(event: H3Event) {
	const response = await event.fetch('https://memes.skyra.pw/api/entries');
	console.log('Fallback Status:', response.status);
	event.node.res.statusCode = response.status;
	return response.json();
}
