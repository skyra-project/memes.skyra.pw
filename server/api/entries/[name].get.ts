import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { Entry, RawEntry } from '../../utils/transform/entry';

export default defineEventHandler<Entry>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	const name = decodeURIComponent(event.context.params!.name);
	const Query = /* sql */ `
		SELECT name, url, avatars, boxes
		FROM templates
		WHERE name = ?;
	`;

	return runOne(db.prepare(Query).bind(name).first<RawEntry>(), transformTemplateEntry);
}
