import type { D1Database, D1Result } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { RawEntry } from '../../utils/transform-entry';

export default defineEventHandler((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	let result: D1Result<RawEntry>;

	const query = getQuery(event);
	const name = query.name as string | undefined;
	if (name && typeof name !== 'string') {
		throw createError({ statusCode: 400, statusMessage: 'The query name must be a string' });
	}

	let limit = query.limit as number | undefined;
	if (limit) {
		if (typeof limit === 'string') limit = Number(limit);
		if (typeof limit !== 'number' || !Number.isSafeInteger(limit)) {
			throw createError({ statusCode: 400, statusMessage: 'The query limit must be an integer' });
		}

		if (limit <= 0) return [];
		if (limit > 25) {
			const token = event.node.req.headers.authorization;
			if (!token || token !== process.env.ARTIEL_TOKEN) {
				throw createError({ statusCode: 403, statusMessage: 'The query limit must be 25 or smaller' });
			}
		}
	}

	limit ??= 25;
	const statement = name ? handleEventSearch(db, decodeURIComponent(name), limit) : handleEventAll(db, limit);
	try {
		result = await statement.all<RawEntry>();
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

function handleEventAll(db: D1Database, limit: number) {
	const Query = /* sql */ `
		SELECT name, url, avatars, boxes
		FROM templates
		ORDER BY uses DESC
		LIMIT ?;
	`;

	console.debug(`Fetching ${limit} entries.`);
	return db.prepare(Query).bind(limit);
}

function handleEventSearch(db: D1Database, query: string, limit: number) {
	const Query = /* sql */ `
		SELECT name, url, avatars, boxes
		FROM templates
		WHERE name LIKE ? ESCAPE '\'
		ORDER BY uses DESC
		LIMIT ?;
	`;

	console.debug(`Fetching ${limit} entries with query ${query}.`);
	return db.prepare(Query).bind(query.replaceAll(/[%_]/g, '\\$1'), limit);
}