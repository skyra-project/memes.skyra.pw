export interface ValidationError {
	statusCode: 400;
	message: string;
}

export function createValidationError(message: string): ValidationError {
	return { statusCode: 400, message };
}

export function throwValidationError(message: string): never {
	throw createValidationError(message);
}
