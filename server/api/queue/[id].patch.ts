import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { Entry } from '../../utils/transform/entry';
import type { QueueEntry, RawQueueEntry } from '../../utils/transform/queue-entry';

const ids = useRuntimeConfig().administrators as string[];

export default defineEventHandler<QueueEntry>((event) => {
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

	const body = validateObject('body', await readBody<Partial<Entry>>(event));
	const lines = [] as string[];
	const values = [id] as unknown[];

	if (typeof body.name !== 'undefined') addProperty('name', validateEntryName(body.name), lines, values);
	if (typeof body.url !== 'undefined') addProperty('url', validateEntryURL(body.url), lines, values);
	if (typeof body.avatars !== 'undefined') addProperty('avatars', JSON.stringify(validateEntryAvatars(body.avatars)), lines, values);
	if (typeof body.boxes !== 'undefined') addProperty('boxes', JSON.stringify(validateEntryBoxes(body.boxes)), lines, values);

	const Query = /* sql */ `
		UPDATE template_queue
		SET ${lines.join(', ')}
		WHERE id = ?1
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

function addProperty<K extends keyof RawQueueEntry>(name: K, value: RawQueueEntry[K], lines: string[], values: unknown[]) {
	lines.push(`${name} = ?${values.length + 1}`);
	values.push(value);
}
