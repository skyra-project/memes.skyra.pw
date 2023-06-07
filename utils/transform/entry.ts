export interface Entry {
	name: string;
	url: string;
	avatars: EntryAvatars;
	boxes: EntryBox[];
}

export interface EntryAvatars {
	author: EntryAvatarPosition[];
	target: EntryAvatarPosition[];
}

export interface EntryAvatarPosition {
	x: number;
	y: number;
	size: number;
	style: 'circle' | 'square';
	rotation: number;
}

export interface EntryBox {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	textColor: `#${string}`;
	modifiers: EntryBoxModifiers;
}

export interface EntryBoxModifiers {
	font: 'impact' | 'arial';
	fontSize: number;
	allCaps: boolean;
	bold: boolean;
	italic: boolean;
	outlineType: 'shadow' | 'outline' | 'none';
	outlineWidth: number;
	outlineColor: `#${string}`;
	textAlign: 'left' | 'center' | 'right';
	verticalAlign: 'top' | 'middle' | 'bottom';
	opacity: number;
}

export interface RawEntry {
	name: string;
	url: string;
	avatars: string;
	boxes: string;
}

export function transformTemplateEntry(entry: RawEntry): Entry {
	return {
		name: entry.name,
		url: entry.url,
		avatars: JSON.parse(entry.avatars),
		boxes: JSON.parse(entry.boxes)
	};
}
