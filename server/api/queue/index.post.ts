import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { Entry } from '../../../utils/transform/entry';
import { transformTemplateQueueEntry, type QueueEntry, type RawQueueEntry } from '../../../utils/transform/queue-entry';
import { validateEntryAvatars, validateEntryBoxes, validateEntryName, validateEntryURL } from '../../../utils/validators/entries';
import { validateObject } from '../../../utils/validators/primitives';

export default defineEventHandler<QueueEntry>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	const session = await requireAuthSession(event);

	const body = validateObject('body', await readBody<Entry>(event));

	const values = [
		session.data.id, //                                    submitter_id,
		Date.now(), //                                         submitted_at
		validateEntryName(body.name), //                       name
		validateEntryURL(body.url), //                         url
		JSON.stringify(validateEntryAvatars(body.avatars)), // avatars
		JSON.stringify(validateEntryBoxes(body.boxes)) //      boxes
	] as unknown[];

	const Query = /* sql */ `
		INSERT INTO template_queue (submitter_id, submitted_at, name, url, avatars, boxes)
		VALUES (?1, ?2, ?3, ?4, ?5, ?6)
		RETURNING id, submitter_id, submitted_at, name, url, avatars, boxes;
	`;
	return runOne(
		db
			.prepare(Query)
			.bind(...values)
			.first<RawQueueEntry>(),
		transformTemplateQueueEntry
	);
}
