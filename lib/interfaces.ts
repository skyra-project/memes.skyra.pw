import type { reactive } from 'vue';

export interface EntryBox {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
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
	textAlign: 'left' | 'center' | 'right';
	verticalAlign: 'top' | 'middle' | 'bottom';
	opacity: number;
}

export interface EntryAvatarPosition {
	x: number;
	y: number;
	size: number;
	style: 'circle' | 'square';
	rotation: number;
}

export interface EntryAvatars {
	author: ReturnType<typeof reactive<EntryAvatarPosition[]>>;
	target: ReturnType<typeof reactive<EntryAvatarPosition[]>>;
}

export type EntryBoxes = ReturnType<typeof reactive<EntryBox[]>>;
