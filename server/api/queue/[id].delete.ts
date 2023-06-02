import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';

const ids = useRuntimeConfig().administrators as string[];

export default defineEventHandler<null>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	const session = await requireAuthSession(event);
	if (!ids.includes(session.data.id)) {
		throw createError({ message: 'You do not have permissions to access this endpoint', statusCode: 403 });
	}

	const id = Number(event.context.params!.id);
	if (!Number.isSafeInteger(id)) {
		throw createError({ message: 'Received invalid ID', statusCode: 400 });
	}

	const Query = /* sql */ `
		DELETE FROM template_queue
		WHERE id = ?;
	`;

	return runQuery(db.prepare(Query).bind(id).run());
}
