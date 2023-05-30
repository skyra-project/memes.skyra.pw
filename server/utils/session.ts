import type { H3Event, SessionConfig } from 'h3';
import crypto from 'uncrypto';

const sessionConfig: SessionConfig = useRuntimeConfig().auth || {};

export interface AuthSession {
	id: string;
	name: string;
	avatar: string | null;
}

export function useAuthSession(event: H3Event) {
	return useSession<AuthSession>(event, sessionConfig);
}

export async function requireAuthSession(event: H3Event) {
	const session = await useAuthSession(event);
	if (!session.data.id) {
		throw createError({ message: 'Not Authorized', statusCode: 401 });
	}
	return session;
}

export async function hash(str: string) {
	const encoded = new TextEncoder().encode(str);
	const hashBuffer = await crypto.subtle.digest('SHA-512', encoded);
	const hashArray = new Uint8Array(hashBuffer);
	const hashHex = [...hashArray].map((b) => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}
