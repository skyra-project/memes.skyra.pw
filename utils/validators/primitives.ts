export function validateBoolean<T extends boolean>(field: string, value: T): T {
	if (typeof value !== 'boolean') throw createError({ message: `\`${field}\` is not a boolean`, statusCode: 400 });
	return value;
}

export function validateString<T extends string>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'string') throw createError({ message: `\`${field}\` is not a string`, statusCode: 400 });
	if (value.length < minimum) throw createError({ message: `\`${field}.length\` cannot be < ${minimum}`, statusCode: 400 });
	if (value.length > maximum) throw createError({ message: `\`${field}.length\` cannot be > ${maximum}`, statusCode: 400 });

	return value;
}

export function validatePossibles<T extends string>(field: string, value: T, possibles: readonly T[]): T {
	if (possibles.includes(value)) return value;
	throw createError({ message: `\`${field}\` is not included in \`${possibles.join('`, `')}\``, statusCode: 400 });
}

export function validateNumber<T extends number>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'number') throw createError({ message: `\`${field}\` is not a number`, statusCode: 400 });
	if (value < minimum) throw createError({ message: `\`${field}\` cannot be < ${minimum}`, statusCode: 400 });
	if (value > maximum) throw createError({ message: `\`${field}\` cannot be > ${maximum}`, statusCode: 400 });

	return value;
}

export function validateInteger<T extends number>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'number') throw createError({ message: `\`${field}\` is not a number`, statusCode: 400 });
	if (!Number.isSafeInteger(value)) throw createError({ message: `\`${field}\` is not an integer`, statusCode: 400 });
	if (value < minimum) throw createError({ message: `\`${field}\` cannot be < ${minimum}`, statusCode: 400 });
	if (value > maximum) throw createError({ message: `\`${field}\` cannot be > ${maximum}`, statusCode: 400 });

	return value;
}

export function validateObject<T extends object>(field: string, value: T): T {
	if (typeof value !== 'object' || value === null) throw createError({ message: `\`${field}\` is not an object`, statusCode: 400 });
	if (Array.isArray(value)) throw createError({ message: `\`${field}\` cannot be an array`, statusCode: 400 });

	return value;
}
