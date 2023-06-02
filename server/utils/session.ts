import type { H3Event } from 'h3';
import { getServerSessionConfig } from '../../utils/auth';

export interface AuthSession {
	id: string;
	name: string;
	avatar: string | null;
}

export function useAuthSession(event: H3Event) {
	return useSession<AuthSession>(event, getServerSessionConfig());
}

export async function requireAuthSession(event: H3Event) {
	const session = await useAuthSession(event);
	if (!session.data.id) {
		throw createError({ message: 'Not Authorized', statusCode: 401 });
	}
	return session;
}
