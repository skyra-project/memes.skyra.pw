import { Entry } from '../../lib/interfaces';

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
