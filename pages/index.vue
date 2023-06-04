<template>
	<label class="mb-5 block">
		Name
		<input type="text" v-model.trim="name" class="base-input w-full rounded" />
	</label>

	<label class="mb-5 block">
		URL
		<input type="url" v-model.trim="url" class="base-input w-full rounded" />
	</label>

	<alert v-if="!debouncedUrl" type="info" title="Tip">
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
	<alert v-else-if="error || !imageData.src" type="danger" title="Error">
		{{ error ? 'The URL you have provided could not be loaded.' : 'The URL you have provided is not a valid image URL.' }}
	</alert>

	<label class="mb-5 flex items-center gap-2">
		Use number input instead of sliders:
		<input type="checkbox" :value="inputType === 'number'" @change.prevent="toggleInputType()" class="checkbox" />
	</label>

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
					:disabled="!image"
				>
					<PlusIcon class="m-auto h-6 w-6" />
				</button>
				<h2 class="text-3xl font-bold">Text Boxes</h2>
			</div>

			<div v-for="(box, index) of boxes" class="mt-5 rounded border-l-2 px-4 py-2 shadow-sm" :class="classes[index % classes.length]">
				<h3 class="text-xl font-bold">Text #{{ index + 1 }}</h3>
				<div class="mt-2 grid grid-cols-2 gap-2">
					<input-slider name="X" v-model="box.x" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" v-model="box.y" :type="inputType" :min="0" :max="height" adornment="px" />
					<input-slider name="Width" v-model="box.width" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Height" v-model="box.height" :type="inputType" :min="0" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="box.rotation" :type="inputType" :min="-180" :max="180" adornment="º" />
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

						<input-slider name="Size" v-model="box.modifiers.fontSize" :type="inputType" :min="1" :max="72" adornment="px" />

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
							:type="inputType"
							:min="0"
							:max="4"
							:step="0.25"
							:disabled="box.modifiers.outlineType === 'none'"
							adornment="px"
						/>

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

						<div>
							Modifiers<span
								:class="{
									uppercase: box.modifiers.allCaps,
									italic: box.modifiers.italic,
									'font-extrabold': box.modifiers.bold
								}"
								class="opacity-80 before:font-medium before:not-italic before:content-[':_']"
								>Ab</span
							>

							<label class="flex items-center gap-2">
								<input type="checkbox" v-model="box.modifiers.allCaps" class="checkbox" />
								All Caps
							</label>

							<label class="flex items-center gap-2">
								<input type="checkbox" v-model="box.modifiers.bold" class="checkbox" />
								Bold
							</label>

							<label class="flex items-center gap-2">
								<input type="checkbox" v-model="box.modifiers.italic" class="checkbox" />
								Italic
							</label>
						</div>

						<input-slider name="Opacity" v-model="box.modifiers.opacity" :type="inputType" :min="0" :max="100" adornment="%" />
					</div>
				</accordion>

				<div class="mt-2 flex">
					<button @click="boxes.splice(index, 1)" class="button danger mt-auto w-full rounded-xl p-2">Remove</button>
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
						:disabled="!image"
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
					<input-slider name="X" v-model="position.x" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" :type="inputType" v-model="position.y" :min="0" :max="height" adornment="px" />
					<input-slider name="Size" v-model="position.size" :type="inputType" :min="16" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="position.rotation" :type="inputType" :min="-180" :max="180" adornment="º" />

					<label>
						Style
						<select v-model="position.style" class="base-input select w-full rounded">
							<option value="circle">Circle</option>
							<option value="square">Square</option>
						</select>
					</label>

					<div class="flex">
						<button @click="avatars[key].splice(index, 1)" class="button danger mt-auto w-full rounded-xl p-2">Remove</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="mb-3 mt-10 border border-gray-800 dark:border-stone-700" />

	<lazy-dialog-entry ref="dialog" @submit="replace" />
	<section class="mb-4 flex justify-end gap-2">
		<button class="button flex items-center gap-2" @click="copy(JSON.stringify({ name, url, avatars, boxes }, undefined, '\t'))">
			<template v-if="copied"><ClipboardDocumentCheckIcon class="h-5 w-5" />Copied</template>
			<template v-else><ClipboardDocumentIcon class="h-5 w-5" />Copy</template>
		</button>
		<button class="button flex items-center gap-2" @click="dialog.showModal()"><ClipboardDocumentListIcon class="h-5 w-5" />Paste</button>
		<button v-if="dirty" class="button danger flex items-center gap-2" @click="resetData"><TrashIcon class="h-5 w-5" />Reset</button>
		<button v-if="$auth.loggedIn.value" class="button success flex items-center gap-2" @click="uploadData">
			<ArrowUpTrayIcon class="h-5 w-5" />Upload
		</button>
		<button v-if="administrator" class="button success flex items-center gap-2" @click="uploadData">
			<DocumentMagnifyingGlassIcon class="h-5 w-5" />Review
		</button>
	</section>
	<codeblock :name="name" :url="url" :avatars="avatars" :boxes="boxes" />
</template>

<script setup lang="ts">
import {
	ArrowUpTrayIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	ClipboardDocumentListIcon,
	DocumentMagnifyingGlassIcon,
	PlusIcon,
	TrashIcon
} from '@heroicons/vue/24/outline';
import { useImage, type UseImageOptions } from '@vueuse/core';
import { Canvas } from 'canvas-constructor/browser';
import type { Entry, EntryAvatarPosition, EntryBox } from '~/utils/transform/entry';

const dialog = ref<HTMLDialogElement>(null!);
const administrator = useAdministrator();

const name = ref('');
const url = ref('');
const debouncedUrl = refDebounced(url, 500, { maxWait: 2000 });
const avatars = {
	author: reactive<EntryAvatarPosition[]>([]),
	target: reactive<EntryAvatarPosition[]>([])
};
const boxes = reactive<EntryBox[]>([]);

const dirty = computed(
	() =>
		name.value.length !== 0 || //
		url.value.length !== 0 ||
		avatars.author.length !== 0 ||
		avatars.target.length !== 0 ||
		boxes.length !== 0
);

if (process.client) {
	const beforeUnloadListener = (event: Event) => {
		event.preventDefault();
		return 'You have pending changes, are you sure you want to leave?';
	};
	watch(dirty, (value) => (value ? addEventListener : removeEventListener)('beforeunload', beforeUnloadListener));
}

function replace(entry: Entry) {
	name.value = entry.name;
	url.value = entry.url;
	avatars.author.splice(0, avatars.author.length, ...entry.avatars.author);
	avatars.target.splice(0, avatars.target.length, ...entry.avatars.target);
	boxes.splice(0, boxes.length, ...entry.boxes);
}

const inputType = ref<'number' | 'range'>('range');
function toggleInputType() {
	inputType.value = inputType.value === 'number' ? 'range' : 'number';
}

const AvatarKeys = ['author', 'target'] as const satisfies readonly AvatarTarget[];
const AvatarNames = ['Author', 'Target'] as const satisfies readonly Capitalize<AvatarTarget>[];
type AvatarTarget = keyof typeof avatars;

const width = 400;
const height = ref(400);

const canvas = ref<HTMLCanvasElement>(null!);
const constructor = computed(() => (canvas.value ? new Canvas(canvas.value) : null));

const imageData = reactive<UseImageOptions>({ src: '', crossorigin: 'anonymous' });
const { isLoading, error, state: image, execute: loadImage } = useImage(imageData, { immediate: false });
watch(debouncedUrl, async (value) => {
	try {
		imageData.src = new URL(value).href;
		await loadImage();
		resizeCanvas();
		printImage();
	} catch {
		imageData.src = '';
		resizeCanvas();
		constructor.value?.clearRectangle();
	}
});

watch([boxes, avatars.author, avatars.target], () => printImage());

function addBox() {
	boxes.push({
		x: 200,
		y: boxes.length === 0 ? 50 : 350,
		width,
		height: 100,
		rotation: 0,
		modifiers: {
			font: 'impact',
			fontSize: 32,
			allCaps: false,
			bold: false,
			italic: false,
			outlineType: 'outline',
			outlineWidth: 4,
			textAlign: 'center',
			verticalAlign: 'middle',
			opacity: 100
		}
	});
}

function addPosition(target: AvatarTarget) {
	avatars[target].push({ x: 50, y: 50, size: 100, style: 'circle', rotation: 0 });
}

const colors = ['#dc2626', '#65a30d', '#059669', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#e11d48'];
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

	const img = image.value;
	if (!img) {
		height.value = width;
	} else if (img.width === img.height) {
		height.value = width;
	} else {
		height.value = width * (img.height / img.width);
	}

	cc.height = height.value;
}

function printImage() {
	const cc = constructor.value;
	if (!cc) return;

	const img = image.value;
	if (!img) return;

	cc.clearRectangle();
	cc.printImage(img, 0, 0, cc.width, cc.height);

	let index = 0;
	for (const box of boxes) {
		cc.setStroke(colors[index]);
		cc.setColor(`${colors[index]}20`);

		const halfWidth = box.width / 2;
		const halfHeight = box.height / 2;

		cc.save();
		cc.translate(box.x, box.y);
		cc.rotate(box.rotation * (Math.PI / 180));
		cc.printRectangle(-halfWidth, -halfHeight, box.width, box.height);
		cc.printStrokeRectangle(-halfWidth, -halfHeight, box.width, box.height);

		cc.beginPath();
		cc.moveTo(-halfWidth, halfHeight);
		cc.lineTo(0, -halfHeight);
		cc.lineTo(halfWidth, halfHeight);
		cc.closePath();
		cc.stroke();

		cc.restore();

		if (++index > colors.length) index = 0;
	}

	index = 0;
	for (const key of AvatarKeys) {
		for (const position of avatars[key]) {
			cc.setStroke(colors[index]);
			cc.setColor(`${colors[index]}20`);

			cc.save();
			cc.translate(position.x, position.y);
			cc.rotate(position.rotation * (Math.PI / 180));

			const halfSize = position.size / 2;

			if (position.style === 'circle') {
				cc.createCircularPath(0, 0, position.size / 2);
				cc.stroke();
				cc.fill();
			} else {
				cc.printRectangle(-halfSize, -halfSize, position.size, position.size);
				cc.printStrokeRectangle(-halfSize, -halfSize, position.size, position.size);
			}

			cc.beginPath();
			cc.moveTo(-halfSize, 0);
			cc.lineTo(halfSize, 0);
			cc.lineTo(0, -halfSize);
			cc.closePath();
			cc.stroke();
			cc.restore();

			if (++index > colors.length) index = 0;
		}
	}
}

const { copied, copy } = useClipboard();

function resetData() {
	name.value = '';
	url.value = '';
	avatars.author.length = 0;
	avatars.target.length = 0;
	boxes.length = 0;
}

function uploadData() {}
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
	background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px);
	background-size: 5px 5px, 5px 5px;
}

select.select:focus {
	--tw-select-arrow-rgb: 75 85 99;
	@apply dark:[--tw-select-rgb:_214_211_209];

	background-image: linear-gradient(45deg, var(--tw-select-arrow-color) 50%, var(--tw-select-bg-color) 50%),
		linear-gradient(135deg, var(--tw-select-bg-color) 50%, var(--tw-select-arrow-color) 50%);
	background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em;
	background-size: 5px 5px, 5px 5px;
}
</style>
