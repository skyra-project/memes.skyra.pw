import type { H3Event } from 'h3';

export function isArtiel(event: H3Event) {
	const token = event.node.req.headers.authorization;
	return !!token && token === process.env.ARTIEL_TOKEN;
}
