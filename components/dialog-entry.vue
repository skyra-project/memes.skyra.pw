<template>
	<dialog
		ref="dialog"
		class="backdrop:backdrop-brightness-[.25] dark:bg-stone-900 dark:text-gray-200 rounded-xl w-full sm:w-3/4 lg:w-2/3"
		@click="$event.target === dialog && dialog.close()"
	>
		<h2 class="text-2xl font-semibold">JSON Editor</h2>

		<alert type="info" title="Tip" closable>
			This is an advanced option for editing all the fields at once, but does not accept invalid or partial information.
		</alert>

		<alert v-if="error" type="danger" title="Error">
			{{ error }}
		</alert>

		<form ref="form" class="w-full h-full" @submit.prevent="submit">
			<label class="block mb-5">
				<textarea
					ref="text"
					class="base-input rounded-lg w-full font-mono"
					rows="6"
					placeholder="The raw JSON object"
					aria-label="An editor to paste a raw JSON object string"
					@keydown.ctrl.enter.exact="submit"
				></textarea>
			</label>

			<div class="flex gap-2 justify-end">
				<button class="button danger" @click.prevent="cancel">Cancel</button>
				<button class="button success">Submit</button>
			</div>
		</form>
	</dialog>
</template>

<script setup lang="ts">
import type { Entry } from '~/utils/transform/entry';
import { validateEntryAvatars, validateEntryBoxes, validateEntryName, validateEntryURL } from '~/utils/validators/entries';
import { validateObject } from '~/utils/validators/primitives';

const emit = defineEmits<{
	(event: 'submit', data: Entry): void;
}>();

defineExpose({ showModal: () => dialog.value.showModal() });

const error = refAutoReset('', 10000);
const dialog = ref<HTMLDialogElement>(null!);
const form = ref<HTMLFormElement>(null!);
const text = ref<HTMLTextAreaElement>(null!);

function cancel() {
	error.value = '';
	form.value.reset();
	dialog.value.close();
}

function submit() {
	let json;
	try {
		json = JSON.parse(text.value.value);
	} catch {
		error.value = 'Could not parse the JSON body';
		return;
	}

	try {
		const body = validateObject('body', json);
		const name = validateEntryName(body.name);
		const url = validateEntryURL(body.url);
		const avatars = validateEntryAvatars(body.avatars);
		const boxes = validateEntryBoxes(body.boxes);

		emit('submit', { name, url, avatars, boxes });
		cancel();
	} catch (validationError) {
		error.value = (validationError as Error).message;
	}
}
</script>
