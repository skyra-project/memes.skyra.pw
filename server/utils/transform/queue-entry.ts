import type { Entry, RawEntry } from './entry';

export interface RawQueueEntry extends RawEntry {
	id: number;
	submitter_id: `${bigint}`;
	submitted_at: bigint;
}

export interface QueueEntry extends Entry {
	id: number;
	submitterId: `${bigint}`;
	submittedAt: number;
}

export function transformTemplateQueueEntry(entry: RawQueueEntry): QueueEntry {
	return {
		id: entry.id,
		submitterId: entry.submitter_id,
		submittedAt: Number(entry.submitted_at),
		name: entry.name,
		url: entry.url,
		avatars: JSON.parse(entry.avatars),
		boxes: JSON.parse(entry.boxes)
	};
}
