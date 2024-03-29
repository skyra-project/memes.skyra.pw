<template>
	<label class="mb-5 block">
		Name
		<input type="text" v-model="name" class="base-input w-full rounded" />
	</label>

	<label class="mb-5 block">
		URL
		<input type="url" v-model="url" class="base-input w-full rounded" />
	</label>

	<alert v-if="!url" type="info" title="Tip">
		Before you can make a template, please fill the above input box with a link to an image to load as a base for the new meme template, for
		example:
		<NuxtLink
			to="https://cdn.skyra.pw/skyra-assets/avatars/rainbow.png"
			target="_blank"
			class="inline-block text-gray-800/80 underline dark:text-gray-200/80"
		>
			https://cdn.skyra.pw/skyra-assets/avatars/rainbow.png
		</NuxtLink>
	</alert>
	<alert v-if="error && url" type="danger" title="Error">
		{{ error }}
	</alert>
	<alert v-if="success" type="success" title="Success">
		{{ success }}
	</alert>

	<div class="mb-5 grid w-full grid-flow-row justify-items-center gap-4 lg:grid-cols-[1fr_416px] xl:grid-cols-[1fr_416px_1fr]">
		<canvas
			:width="width"
			height="400"
			ref="canvas"
			class="w-full max-w-fit rounded-xl border-8 border-gray-200 bg-gray-300 shadow-xl dark:border-stone-900 dark:bg-stone-900"
			:class="isLoading ? 'animate-pulse' : ''"
			aria-label="Preview"
			role="figure"
		></canvas>

		<div
			class="h-[70vh] max-h-[600px] min-h-[416px] w-full overflow-y-auto rounded-xl bg-gray-200 p-5 shadow-xl dark:bg-stone-900 lg:order-first"
		>
			<div class="flex items-center gap-2">
				<button
					@click="addBox"
					class="button success h-8 w-8 rounded p-0"
					aria-label="Add a new text box"
					title="Add a new text box"
					:disabled="!isReady"
				>
					<PlusIcon class="m-auto h-6 w-6" />
				</button>
				<h2 class="text-3xl font-bold">Text Boxes</h2>
			</div>

			<div v-for="(box, index) of boxes" class="mt-5 rounded border-l-2 px-4 py-2 shadow-sm" :class="classes[index % classes.length]">
				<h3 class="text-xl font-bold">Text #{{ index + 1 }}</h3>
				<div class="mt-2 grid grid-cols-2 gap-2">
					<input-slider name="X" v-model="box.x" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" v-model="box.y" :min="0" :max="height" adornment="px" />
					<input-slider name="Width" v-model="box.width" :min="0" :max="width" adornment="px" />
					<input-slider name="Height" v-model="box.height" :min="0" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="box.rotation" :min="-180" :max="180" adornment="º" />
					<input-color name="Color" v-model="box.textColor" />
				</div>

				<accordion class="mt-2 rounded-xl bg-gray-300 dark:bg-stone-950" header="Details">
					<div class="grid grid-cols-2 gap-2 rounded-xl bg-gray-200 p-2 dark:bg-stone-900">
						<label>
							Font
							<select v-model="box.modifiers.font" class="base-input select w-full rounded">
								<option value="impact">Impact</option>
								<option value="arial">Arial</option>
							</select>
						</label>

						<input-slider name="Size" v-model="box.modifiers.fontSize" :min="1" :max="72" adornment="px" />

						<label>
							Outline Type
							<select v-model="box.modifiers.outlineType" class="base-input select w-full rounded">
								<option value="outline">Outline</option>
								<option value="shadow">Shadow</option>
								<option value="none">None</option>
							</select>
						</label>

						<input-slider
							name="Width"
							v-model="box.modifiers.outlineWidth"
							:min="0"
							:max="4"
							:step="0.25"
							:disabled="box.modifiers.outlineType === 'none'"
							adornment="px"
						/>

						<input-color name="Outline Color" v-model="box.modifiers.outlineColor" />

						<label>
							Text Align
							<select v-model="box.modifiers.textAlign" class="base-input select w-full rounded">
								<option value="left">Left</option>
								<option value="center">Center</option>
								<option value="right">Right</option>
							</select>
						</label>

						<label>
							Vertical Align
							<select v-model="box.modifiers.verticalAlign" class="base-input select w-full rounded">
								<option value="top">Top</option>
								<option value="middle">Middle</option>
								<option value="bottom">Bottom</option>
							</select>
						</label>

						<input-slider name="Opacity" v-model="box.modifiers.opacity" :min="0" :max="100" adornment="%" />

						<div class="col-span-2">
							Modifiers<span
								:class="{
									uppercase: box.modifiers.allCaps,
									italic: box.modifiers.italic,
									'font-extrabold': box.modifiers.bold
								}"
								class="opacity-80 before:font-medium before:not-italic before:content-[':_']"
								>Ab</span
							>

							<input-text-modifiers
								v-model:all-caps="box.modifiers.allCaps"
								v-model:bold="box.modifiers.bold"
								v-model:italic="box.modifiers.italic"
							/>
						</div>
					</div>
				</accordion>

				<div class="mt-2 flex">
					<button @click="boxes.splice(index, 1)" class="button danger w-full justify-center p-2">Remove</button>
				</div>
			</div>
		</div>

		<div
			class="h-[70vh] max-h-[600px] min-h-[416px] w-full overflow-y-auto rounded-xl bg-gray-200 p-5 shadow-xl dark:bg-stone-900 lg:col-span-2 xl:col-auto"
		>
			<h2 class="text-3xl font-bold">Avatars</h2>
			<div
				v-for="(key, index) of AvatarKeys"
				class="mt-5 grid grid-rows-1 gap-5 rounded border-l-2 px-4 py-2 shadow-sm"
				:class="classes[(index + 4) % classes.length]"
			>
				<div class="flex items-center gap-2">
					<button
						@click="addPosition(key)"
						class="button success h-8 w-8 rounded p-0"
						aria-label="Add a new position to this avatar"
						title="Add a new position to this avatar"
						:disabled="!isReady"
					>
						<PlusIcon class="m-auto h-6 w-6" />
					</button>
					<h3 class="text-2xl font-bold">{{ AvatarNames[index] }}</h3>
				</div>

				<div
					v-for="(position, index) of avatars[key]"
					class="grid grid-cols-2 gap-2 rounded border-l-2 px-4 py-2 shadow-sm"
					:class="classes[index % classes.length]"
				>
					<input-slider name="X" v-model="position.x" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" v-model="position.y" :min="0" :max="height" adornment="px" />
					<input-slider name="Size" v-model="position.size" :min="16" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="position.rotation" :min="-180" :max="180" adornment="º" />

					<label>
						Style
						<select v-model="position.style" class="base-input select w-full rounded">
							<option value="circle">Circle</option>
							<option value="square">Square</option>
						</select>
					</label>

					<div class="flex">
						<button @click="avatars[key].splice(index, 1)" class="button danger mt-auto w-full justify-center p-2">Remove</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="mb-3 mt-10 border border-gray-800 dark:border-stone-700" />

	<lazy-dialog-entry ref="dialog" @submit="replace" />
	<section class="mb-2 flex justify-end gap-2">
		<button class="button gap-2" @click="copy(JSON.stringify(makeBody(), undefined, '\t'))">
			<template v-if="copied"><ClipboardDocumentCheckIcon class="h-5 w-5" />Copied</template>
			<template v-else><ClipboardDocumentIcon class="h-5 w-5" />Copy</template>
		</button>
		<button class="button gap-2" @click="dialog.showModal()"><ClipboardDocumentListIcon class="h-5 w-5" />Paste</button>
		<button v-if="dirty" class="button danger gap-2" @click="resetData"><TrashIcon class="h-5 w-5" />Reset</button>
		<template v-if="$auth.loggedIn.value && dirty">
			<button v-if="previewingId" :disabled="!name || !url || !boxes.length" class="button warning gap-2" @click="updateData">
				<ArrowPathIcon class="h-5 w-5" />Update
			</button>
			<button v-else :disabled="name.length < 2 || !url || !boxes.length" class="button success gap-2" @click="uploadData">
				<ArrowUpTrayIcon class="h-5 w-5" />Upload
			</button>
		</template>
		<template v-if="administrator">
			<button v-if="reviewing" class="button gap-2" @click="reviewing = false"><DocumentMinusIcon class="h-5 w-5" />Stop Review</button>
			<button v-else class="button success gap-2" @click="reviewing = true"><DocumentCheckIcon class="h-5 w-5" />Review</button>
		</template>
	</section>
	<lazy-admin-review v-if="administrator && reviewing" ref="administratorReview" @preview="preview" />
	<codeblock :name="name" :url="url" :avatars="avatars" :boxes="boxes" />
</template>

<script setup lang="ts">
import {
	ArrowPathIcon,
	ArrowUpTrayIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	ClipboardDocumentListIcon,
	DocumentCheckIcon,
	DocumentMinusIcon,
	PlusIcon,
	TrashIcon
} from '@heroicons/vue/24/outline';
import { Canvas } from 'canvas-constructor/browser';
import { AvatarKeys, renderCanvas } from '~/utils/canvas';
import type { Entry, EntryAvatarPosition, EntryBox } from '~/utils/transform/entry';
import type { QueueEntry } from '~/utils/transform/queue-entry';

const dialog = ref<HTMLDialogElement>(null!);
const administrator = useAdministrator();
const reviewing = ref(false);

const error = ref('');
const name = ref('');
const url = ref('');
const avatars = {
	author: reactive<EntryAvatarPosition[]>([]),
	target: reactive<EntryAvatarPosition[]>([])
};
const boxes = reactive<EntryBox[]>([]);
const success = refAutoReset('', 7500);

const debouncedUrl = useDebounce(url, 250, { maxWait: 2000 });

const dirty = computed(
	() =>
		name.value.length !== 0 || //
		url.value.length !== 0 ||
		avatars.author.length !== 0 ||
		avatars.target.length !== 0 ||
		boxes.length !== 0
);

if (process.client && !process.dev) {
	const beforeUnloadListener = (event: Event) => {
		event.preventDefault();
		return 'You have pending changes, are you sure you want to leave?';
	};
	watch(dirty, (value) => (window.onbeforeunload = value ? beforeUnloadListener : null));
}

function replace(entry: Entry) {
	name.value = entry.name;
	url.value = entry.url;
	avatars.author.splice(0, avatars.author.length, ...entry.avatars.author);
	avatars.target.splice(0, avatars.target.length, ...entry.avatars.target);
	boxes.splice(0, boxes.length, ...entry.boxes.map((box) => ({ ...box, modifiers: { ...box.modifiers, opacity: box.modifiers.opacity * 100 } })));
}

const AvatarNames = ['Author', 'Target'] as const satisfies readonly Capitalize<AvatarTarget>[];
type AvatarTarget = keyof typeof avatars;

const width = 400;
const height = ref(400);

const canvas = ref<HTMLCanvasElement>(null!);
const constructor = computed(() => (canvas.value ? new Canvas(canvas.value) : null));

const isLoading = ref(false);
const isReady = ref(false);
const imageSrc = ref('');
const image = process.client ? new Image() : null;
if (image) {
	image.crossOrigin = 'anonymous';
	const onLoad = () => {
		isLoading.value = false;
		isReady.value = true;
		error.value = '';
	};
	const setError = (message: string) => {
		isLoading.value = false;
		isReady.value = false;
		error.value = message;
	};

	useEventListener(image, 'load', onLoad);
	useEventListener(image, 'error', () =>
		setError(imageSrc.value ? 'The URL you have provided could not be loaded (The resource could not be loaded or does not exist)' : '')
	);

	watch(imageSrc, (src) => {
		isLoading.value = true;
		image.src = src;
	});

	watch(debouncedUrl, (value) => {
		if (!value) {
			imageSrc.value = '';
			return;
		}

		try {
			const { src, replace } = replaceUrl(new URL(value).href);
			if (replace) url.value = src;
			if (image.src === src) {
				onLoad();
			} else {
				imageSrc.value = src;
			}
		} catch {
			setError('The URL you have provided could not be loaded (Invalid URL)');
		}
	});

	watch([isLoading, isReady], () => {
		if (isReady) {
			resizeCanvas();
			printImage();
		} else {
			resetImage();
		}
	});
}

function resetImage() {
	resizeCanvas();
	constructor.value?.clearRectangle();
}

watch([boxes, avatars.author, avatars.target], () => printImage());

function addBox() {
	boxes.push({
		x: 200,
		y: boxes.length === 0 ? 50 : 350,
		width,
		height: 100,
		rotation: 0,
		textColor: '#ffffff',
		modifiers: {
			font: 'impact',
			fontSize: 32,
			allCaps: false,
			bold: false,
			italic: false,
			outlineType: 'outline',
			outlineWidth: 4,
			outlineColor: '#000000',
			textAlign: 'center',
			verticalAlign: 'middle',
			opacity: 100
		}
	});
}

function addPosition(target: AvatarTarget) {
	avatars[target].push({ x: 50, y: 50, size: 100, style: 'circle', rotation: 0 });
}

const classes = [
	'border-red-600',
	'border-lime-600',
	'border-emerald-600',
	'border-cyan-600',
	'border-blue-600',
	'border-violet-600',
	'border-pink-600',
	'border-rose-600'
];

function resizeCanvas() {
	const cc = constructor.value;
	if (!cc) return;

	if (!isReady.value) {
		height.value = width;
	} else if (image!.width === image!.height) {
		height.value = width;
	} else {
		height.value = width * (image!.height / image!.width);
	}

	cc.height = height.value;
}

function printImage() {
	const cc = constructor.value;
	if (!cc) return;
	if (!isReady.value) return;

	renderCanvas(cc, image!, boxes, avatars);
}

const { copied, copy } = useClipboard();

function resetData() {
	previewingId.value = null;
	name.value = '';
	url.value = '';
	avatars.author.length = 0;
	avatars.target.length = 0;
	boxes.length = 0;
}

function makeBody(): Entry {
	return {
		name: name.value,
		url: url.value,
		avatars,
		boxes: boxes.map((box) => ({ ...box, modifiers: { ...box.modifiers, opacity: Math.round(box.modifiers.opacity / 100) } }))
	};
}

async function uploadData() {
	const { error: uploadError } = await useFetch('/api/queue', { method: 'POST', body: makeBody() });
	if (uploadError.value) {
		error.value = uploadError.value.data?.message ?? uploadError.value.message;
		return;
	}

	success.value = `Successfully uploaded '${name.value}'!`;
}

const administratorReview = ref<{ updateEntry(data: QueueEntry): void }>();
const previewingId = ref<number | null>(null);

function preview(entry: QueueEntry) {
	previewingId.value = entry.id;
	replace(entry);
}

async function updateData() {
	const id = previewingId.value;
	if (!id) return;

	const { data, error: updateError } = await useFetch(`/api/queue/${id}`, { method: 'PATCH' });
	if (updateError.value) {
		error.value = updateError.value.data?.message ?? updateError.value.message;
		return;
	}

	administratorReview.value!.updateEntry(data.value!);
	success.value = `Successfully updated '${data.value!.name}'!`;
}
</script>

<style scoped>
select.select {
	--tw-border-opacity: 1;
	--tw-select-arrow-rgb: 209 213 219;
	--tw-select-arrow-color: rgb(var(--tw-select-arrow-rgb) / var(--tw-border-opacity));
	--tw-select-bg-rgb: 243 244 246;
	--tw-select-bg-color: rgb(var(--tw-select-bg-rgb) / var(--tw-border-opacity));

	@apply appearance-none bg-no-repeat dark:[--tw-select-arrow-rgb:_68_64_60] dark:[--tw-select-bg-rgb:_28_25_23];

	background-image: linear-gradient(45deg, var(--tw-select-bg-color) 50%, var(--tw-select-arrow-color) 50%),
		linear-gradient(135deg, var(--tw-select-arrow-color) 50%, var(--tw-select-bg-color) 50%);
	background-position:
		calc(100% - 20px) calc(1em + 2px),
		calc(100% - 15px) calc(1em + 2px);
	background-size:
		5px 5px,
		5px 5px;
}

select.select:focus {
	--tw-select-arrow-rgb: 75 85 99;
	@apply dark:[--tw-select-rgb:_214_211_209];

	background-image: linear-gradient(45deg, var(--tw-select-arrow-color) 50%, var(--tw-select-bg-color) 50%),
		linear-gradient(135deg, var(--tw-select-bg-color) 50%, var(--tw-select-arrow-color) 50%);
	background-position:
		calc(100% - 15px) 1em,
		calc(100% - 20px) 1em;
	background-size:
		5px 5px,
		5px 5px;
}
</style>
