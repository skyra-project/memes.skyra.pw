export function validateBoolean<T extends boolean>(field: string, value: T): T {
	if (typeof value !== 'boolean') throwValidationError(`\`${field}\` is not a boolean`);
	return value;
}

export function validateString<T extends string>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'string') throwValidationError(`\`${field}\` is not a string`);
	if (value.length < minimum) throwValidationError(`\`${field}.length\` cannot be < ${minimum}`);
	if (value.length > maximum) throwValidationError(`\`${field}.length\` cannot be > ${maximum}`);

	return value;
}

export function validatePossibles<T extends string>(field: string, value: T, possibles: readonly T[]): T {
	if (possibles.includes(value)) return value;
	throwValidationError(`\`${field}\` is not included in \`${possibles.join('`, `')}\``);
}

export function validateNumber<T extends number>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'number') throwValidationError(`\`${field}\` is not a number`);
	if (value < minimum) throwValidationError(`\`${field}\` cannot be < ${minimum}`);
	if (value > maximum) throwValidationError(`\`${field}\` cannot be > ${maximum}`);

	return value;
}

export function validateInteger<T extends number>(field: string, value: T, minimum: number, maximum: number): T {
	if (typeof value !== 'number') throwValidationError(`\`${field}\` is not a number`);
	if (!Number.isSafeInteger(value)) throwValidationError(`\`${field}\` is not an integer`);
	if (value < minimum) throwValidationError(`\`${field}\` cannot be < ${minimum}`);
	if (value > maximum) throwValidationError(`\`${field}\` cannot be > ${maximum}`);

	return value;
}

export function validateObject<T extends object>(field: string, value: T): T {
	if (typeof value !== 'object' || value === null) throwValidationError(`\`${field}\` is not an object`);
	if (Array.isArray(value)) throwValidationError(`\`${field}\` cannot be an array`);

	return value;
}
