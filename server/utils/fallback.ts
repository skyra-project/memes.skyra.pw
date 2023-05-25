import type { H3Event } from 'h3';

export async function fallbackHandleEvent(event: H3Event) {
	const response = await event.fetch(`https://memes.skyra.pw${event.path}`);
	console.debug(`Fallback ${event.path}. Status: ${response.status}`);
	event.node.res.statusCode = response.status;
	return response.json();
}
