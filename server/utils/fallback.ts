import type { H3Event } from 'h3';

export function fallbackHandleEvent<T = unknown>(event: H3Event): Promise<T> {
	return proxyRequest(event, `https://memes.skyra.pw${event.path}`);
}
