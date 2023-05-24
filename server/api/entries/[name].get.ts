import type { D1Database } from '@cloudflare/workers-types';
import type { RawEntry } from '../../utils/transform-entry';

export default defineEventHandler(async (event) => {
	const db: D1Database = event.context.cloudflare.env.DATABASE;

	try {
		return await db
			.prepare('SELECT name, url, avatars, boxes FROM templates WHERE id = ?')
			.bind(event.context.params!.id)
			.first<RawEntry>()
			.then(transformTemplateEntry);
	} catch (error) {
		throw createError({
			statusCode: 404,
			statusMessage: String(error ?? 'Received an error')
		});
	}
});
