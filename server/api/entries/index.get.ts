import { D1Result } from '@cloudflare/workers-types';
import type { RawEntry } from '../../utils/transform-entry';

export default defineEventHandler(async (event) => {
	let result: D1Result<RawEntry>;
	try {
		result = await useDatabase(event).prepare('SELECT name, url, avatars, boxes FROM templates ORDER BY uses DESC').all<RawEntry>();
		if (result.success) return result.results!.map(transformTemplateEntry);
	} catch (error) {
		if (error instanceof Error) error = (error.cause as Error)?.message ?? error.message;
		throw createError({
			statusCode: 500,
			statusMessage: String(error ?? 'Received an error')
		});
	}

	throw createError({
		statusCode: 500,
		statusMessage: result.error ?? 'Received an error'
	});
});
