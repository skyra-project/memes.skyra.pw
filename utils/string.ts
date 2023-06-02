export function addQuotes<T extends string>(value: T): `"${T}"` {
	return `"${value}"`;
}
