import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { QueueEntry, RawQueueEntry } from '../../utils/transform/queue-entry';

const ids = useRuntimeConfig().administrators as string[];

export default defineEventHandler<QueueEntry[]>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	const session = await requireAuthSession(event);
	if (!ids.includes(session.data.id)) {
		throw createError({ message: 'You do not have permissions to access this endpoint', statusCode: 403 });
	}

	const Query = /* sql */ `
		SELECT id, submitter_id, submitted_at, name, url, avatars, boxes
		FROM template_queue
		ORDER BY submitted_at ASC
		LIMIT 25;
	`;
	return runAll(db.prepare(Query).all<RawQueueEntry>(), transformTemplateQueueEntry);
}
