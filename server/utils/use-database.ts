import type { D1Database, D1Result } from '@cloudflare/workers-types';

export const useDatabase = () => process.env.DATABASE as unknown as D1Database;

export async function runAll<T>(promise: Promise<D1Result<T>>): Promise<D1Result<T>>;
export async function runAll<T, R>(promise: Promise<D1Result<T>>, map: (value: T) => R): Promise<R[]>;
export async function runAll<T, R>(promise: Promise<D1Result<T>>, map?: (value: T) => R): Promise<D1Result<T> | R[]> {
	let result: D1Result<T>;
	try {
		result = await promise;
		if (result.success) return typeof map === 'function' ? result.results!.map(map) : result;
	} catch (error) {
		if (error instanceof Error) error = (error.cause as Error)?.message ?? error.message;
		throw createError({ statusCode: 500, statusMessage: String(error ?? 'Received an unknown error') });
	}

	throw createError({ statusCode: 500, statusMessage: result.error ?? 'Received an unknown error' });
}

export async function runOne<T, R>(promise: Promise<T>, map: (value: T) => R): Promise<R> {
	try {
		return map(await promise);
	} catch (error) {
		if (error instanceof Error) error = (error.cause as Error)?.message ?? error.message;
		throw createError({ statusCode: 500, statusMessage: String(error ?? 'Received an unknown error') });
	}
}

export async function runQuery<T>(promise: Promise<D1Result<T>>): Promise<null> {
	await runAll(promise);
	return null;
}
