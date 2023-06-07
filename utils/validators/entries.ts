import type { EntryAvatarPosition, EntryAvatars, EntryBox, EntryBoxModifiers } from '../transform/entry';
import { validateBoolean, validateHexString, validateInteger, validateNumber, validateObject, validatePossibles, validateString } from './primitives';

export function validateEntryName(value: string): string {
	return validateString('name', value, 2, 64);
}

export function validateEntryURL(value: string): string {
	validateString('url', value, 12, 128);

	try {
		return new URL(value).href;
	} catch {
		throwValidationError('`url` is not a valid URL');
	}
}

export function validateEntryAvatars(value: EntryAvatars): EntryAvatars {
	validateObject('avatars', value);

	return {
		author: validateEntryAvatarPositions('avatars.author', value.author),
		target: validateEntryAvatarPositions('avatars.target', value.target)
	};
}

export function validateEntryAvatarPositions(field: `avatars.${keyof EntryAvatars}`, values: readonly EntryAvatarPosition[]): EntryAvatarPosition[] {
	if (!Array.isArray(values)) throwValidationError(`\`${field}\` is not an array`);
	return values.map((value, index) => validateEntryAvatarPosition(`${field}.${index}`, value));
}

export function validateEntryAvatarPosition(field: `avatars.${keyof EntryAvatars}.${number}`, value: EntryAvatarPosition): EntryAvatarPosition {
	validateObject(field, value);

	return {
		x: validateInteger(`${field}.x`, value.x, -1000, 1000),
		y: validateInteger(`${field}.y`, value.y, -1000, 2000),
		size: validateInteger(`${field}.size`, value.size, 20, 256),
		style: validatePossibles(`${field}.style`, value.style, ['circle', 'square']),
		rotation: validateInteger(`${field}.rotation`, value.rotation, -180, 180)
	};
}

export function validateEntryBoxes(values: readonly EntryBox[]): EntryBox[] {
	if (!Array.isArray(values)) throwValidationError('`boxes` is not an array');
	return values.map((value, index) => validateEntryBox(`boxes.${index}`, value));
}

export function validateEntryBox(field: `boxes.${number}`, value: EntryBox): EntryBox {
	validateObject(field, value);

	return {
		x: validateInteger(`${field}.x`, value.x, -1000, 1000),
		y: validateInteger(`${field}.y`, value.y, -1000, 2000),
		width: validateInteger(`${field}.width`, value.width, 20, 512),
		height: validateInteger(`${field}.height`, value.height, 20, 512),
		rotation: validateInteger(`${field}.rotation`, value.rotation, -180, 180),
		textColor: validateHexString(`${field}.textColor`, value.textColor),
		modifiers: validateEntryBoxModifiers(`${field}.modifiers`, value.modifiers)
	};
}

export function validateEntryBoxModifiers(field: `boxes.${number}.modifiers`, value: EntryBoxModifiers): EntryBoxModifiers {
	validateObject(field, value);

	return {
		font: validatePossibles(`${field}.font`, value.font, ['impact', 'arial']),
		fontSize: validateInteger(`${field}.fontSize`, value.fontSize, 6, 72),
		allCaps: validateBoolean(`${field}.allCaps`, value.allCaps),
		bold: validateBoolean(`${field}.bold`, value.bold),
		italic: validateBoolean(`${field}.italic`, value.italic),
		outlineType: validatePossibles(`${field}.outlineType`, value.outlineType, ['shadow', 'outline', 'none']),
		outlineWidth: validateNumber(`${field}.outlineWidth`, value.outlineWidth, 0, 4),
		outlineColor: validateHexString(`${field}.outlineColor`, value.outlineColor),
		textAlign: validatePossibles(`${field}.textAlign`, value.textAlign, ['left', 'center', 'right']),
		verticalAlign: validatePossibles(`${field}.verticalAlign`, value.verticalAlign, ['top', 'middle', 'bottom']),
		opacity: validateInteger(`${field}.opacity`, value.opacity, 0, 1)
	};
}
