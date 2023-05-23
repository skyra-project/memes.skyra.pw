import type { reactive } from 'vue';

export interface EntryBox {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	modifiers: EntryBoxModifiers;
}

export interface EntryAvatarPosition {
	x: number;
	y: number;
	size: number;
	style: 'circle' | 'square';
	rotation: number;
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
