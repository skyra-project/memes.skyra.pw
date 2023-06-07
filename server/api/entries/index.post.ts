import type { D1Database } from '@cloudflare/workers-types';
import type { H3Event } from 'h3';
import type { Entry, RawEntry } from '../../utils/exports';

const ids = useAdministrators();

export default defineEventHandler<Entry>((event) => {
	const db = useDatabase();
	return db ? handleEvent(event, db) : fallbackHandleEvent(event);
});

async function handleEvent(event: H3Event, db: D1Database) {
	const session = await requireAuthSession(event);
	if (!ids.includes(session.data.id)) {
		throw createError({ message: 'You do not have permissions to access this endpoint', statusCode: 403 });
	}

	const body = validateObject('body', await readBody<Entry>(event));

	const values = [
		validateEntryName(body.name), //                       name
		validateEntryURL(body.url), //                         url
		JSON.stringify(validateEntryAvatars(body.avatars)), // avatars
		JSON.stringify(validateEntryBoxes(body.boxes)) //      avatars
	] as unknown[];

	const Query = /* sql */ `
		INSERT INTO templates (name, url, avatars, boxes)
		VALUES (?1, ?2, ?3, ?4)
		RETURNING name, url, avatars, boxes;
	`;
	return runOne(
		db
			.prepare(Query)
			.bind(...values)
			.first<RawEntry>(),
		transformTemplateEntry
	);
}
