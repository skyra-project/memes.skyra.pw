<template>
	<div class="mb-2 max-h-[min(24rem,50vh)] overflow-auto rounded-xl bg-gray-200 p-5 dark:bg-stone-900">
		<h2 class="text-3xl font-semibold">Review Panel</h2>
		<alert v-if="error" type="danger" title="Error">
			Failed to fetch the queue.
			<pre>{{ error }}</pre>
		</alert>
		<alert v-if="entries?.length === 0" type="success"> There are no pending entries. </alert>

		<div v-for="entry in entries" class="mt-2 flex gap-2 rounded-xl p-2 dark:bg-stone-800">
			<div class="w-32">
				<img :src="entry.url" :alt="entry.name" crossorigin="anonymous" loading="lazy" class="rounded-lg" />
			</div>
			<div class="grow">
				<div class="mb-2 flex items-center gap-2">
					<h3 class="text-2xl font-semibold">{{ entry.name }}</h3>
					<span class="flex items-center gap-1 rounded-xl px-2 py-1 dark:bg-stone-900" title="Text boxes">
						{{ entry.boxes.length }}
						<ChatBubbleBottomCenterTextIcon aria-label="Text boxes" class="h-5 w-5" />
					</span>
					<span class="flex items-center gap-1 rounded-xl px-2 py-1 dark:bg-stone-900" title="Author avatar positions">
						{{ entry.avatars.author.length }}
						<UserIcon aria-label="Author avatar positions" class="h-5 w-5" />
					</span>
					<span class="flex items-center gap-1 rounded-xl px-2 py-1 dark:bg-stone-900" title="Target avatar positions">
						{{ entry.avatars.target.length }}
						<UserCircleIcon aria-label="Target avatar positions" class="h-5 w-5" />
					</span>
				</div>
				<p class="mb-3">
					Submitted on
					<span class="rounded-lg p-1 dark:bg-stone-900">{{ date.format(entry.submittedAt) }}</span>
					by user ID
					<span class="rounded-lg p-1 font-mono dark:bg-stone-900">{{ entry.submitterId }}</span>
				</p>
				<section class="mt-auto flex justify-end gap-2">
					<button class="button gap-2" @click="previewEntry(entry.id)"><MagnifyingGlassIcon class="h-5 w-5" />Preview</button>
					<button class="button danger gap-2" @click="deleteEntry(entry.id)"><TrashIcon class="h-5 w-5" />Delete</button>
					<button class="button success gap-2" @click="uploadEntry(entry.id)"><ArrowUpTrayIcon class="h-5 w-5" />Upload</button>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ArrowUpTrayIcon, ChatBubbleBottomCenterTextIcon, MagnifyingGlassIcon, TrashIcon, UserCircleIcon, UserIcon } from '@heroicons/vue/24/outline';
import type { QueueEntry } from '~/utils/transform/queue-entry';

const emit = defineEmits<{
	(event: 'preview', data: QueueEntry): void;
}>();

const { data, error } = await useFetch('/api/queue');
const entries = toReactive<QueueEntry[]>([]);

function getEntryIndex(id: number) {
	return entries.findIndex((value) => value.id === id);
}

async function previewEntry(id: number) {
	const entry = entries.find((value) => value.id === id);
	if (entry) emit('preview', entry);
}

async function deleteEntry(id: number) {
	const index = getEntryIndex(id);
	if (index === -1) return;

	// TODO: Fill logic
	entries.splice(index, 1);
}

async function uploadEntry(id: number) {
	const index = getEntryIndex(id);
	if (index === -1) return;

	// TODO: Fill logic
	entries.splice(index, 1);
}

watch(data, (values) => (values?.length ? entries.splice(0, entries.length, ...values) : (entries.length = 0)));

const date = new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium', dateStyle: 'full' });
</script>
