<template>
	<div class="mb-2 max-h-[min(24rem,50vh)] overflow-auto rounded-xl bg-gray-200 p-5 dark:bg-stone-900">
		<h2 class="text-3xl font-semibold">Review Panel</h2>
		<alert v-if="error" type="danger" title="Error">
			Failed to fetch the queue.
			<pre>{{ error }}</pre>
		</alert>
		<alert v-if="requestError" type="danger" title="Error">
			Failed to do operation the queue.
			<pre>{{ requestError }}</pre>
		</alert>
		<alert v-if="entries?.length === 0" type="success"> There are no pending entries. </alert>

		<div v-for="entry in entries" class="mt-2 flex gap-2 rounded-xl p-2 dark:bg-stone-800">
			<div class="w-32">
				<img :src="replaceUrl(entry.url).src" :alt="entry.name" crossorigin="anonymous" loading="lazy" class="rounded-lg" />
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
					<button class="button gap-2" @click="previewEntry(entry.id)" :disabled="loading">
						<MagnifyingGlassIcon class="h-5 w-5" />Preview
					</button>
					<button class="button danger gap-2" @click="deleteEntry(entry.id)" :disabled="loading">
						<TrashIcon class="h-5 w-5" />Delete
					</button>
					<button class="button success gap-2" @click="uploadEntry(entry.id)" :disabled="loading">
						<ArrowUpTrayIcon class="h-5 w-5" />Upload
					</button>
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
defineExpose({ updateEntry });

const { data, error } = await useFetch('/api/queue');

const entries = toReactive<QueueEntry[]>([]);
const loading = ref(false);
const requestError = refAutoReset('', 5000);

function isErrorResponse(result: { error: Ref<Error | null> }) {
	if (result.error.value) {
		requestError.value = result.error.value.message;
		return true;
	}

	return false;
}

async function loadingBoundary(cb: () => Promise<void>) {
	loading.value = true;
	try {
		await cb();
	} finally {
		loading.value = false;
	}
}

function getEntry(id: number) {
	return entries.find((value) => value.id === id);
}

function getEntryIndex(id: number) {
	return entries.findIndex((value) => value.id === id);
}

async function previewEntry(id: number) {
	const entry = getEntry(id);
	if (!entry) return;

	emit('preview', {
		...entry,
		avatars: {
			author: entry.avatars.author.map((entry) => ({ ...entry })),
			target: entry.avatars.target.map((entry) => ({ ...entry }))
		},
		boxes: entry.boxes.map((box) => ({ ...box, modifiers: { ...box.modifiers } }))
	});
}

async function deleteEntry(id: number) {
	const index = getEntryIndex(id);
	if (index === -1) return;

	loadingBoundary(async () => {
		if (isErrorResponse(await useFetch(`/api/queue/${id}`, { method: 'DELETE' }))) return;
		entries.splice(index, 1);
	});
}

async function uploadEntry(id: number) {
	const index = getEntryIndex(id);
	if (index === -1) return;

	loadingBoundary(async () => {
		if (isErrorResponse(await useFetch('/api/entries', { method: 'POST', body: entries[index] }))) return;
		if (isErrorResponse(await useFetch(`/api/queue/${id}`, { method: 'DELETE' }))) return;
		entries.splice(index, 1);
	});
}

function updateEntry(data: QueueEntry) {
	const entry = getEntry(data.id);
	if (!entry) return;

	entry.name = data.name;
	entry.url = data.url;
	entry.avatars.author = data.avatars.author.map((entry) => ({ ...entry }));
	entry.avatars.target = data.avatars.target.map((entry) => ({ ...entry }));
	entry.boxes = data.boxes.map((box) => ({ ...box, modifiers: { ...box.modifiers } }));
}

watch(data, (values) => (values?.length ? entries.splice(0, entries.length, ...values) : (entries.length = 0)), { immediate: true });

const date = new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium', dateStyle: 'full' });
</script>
