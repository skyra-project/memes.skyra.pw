import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';

export default defineEventHandler<{ uses: number }>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	if (!isArtiel(event)) {
		throw createError({ message: 'You cannot use this endpoint', statusCode: 403 });
	}

	const name = decodeURIComponent(event.context.params!.name);
	const Query = /* sql */ `
		UPDATE templates
		SET uses = uses + 1
		WHERE id = ?1
		RETURNING uses;
	`;

	return runOne(db.prepare(Query).bind(name).first<{ uses: number }>());
}
