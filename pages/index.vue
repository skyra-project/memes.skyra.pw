<template>
	<label class="block mb-5">
		Name
		<input type="text" v-model.trim="name" class="base-input rounded w-full" />
	</label>

	<label class="block mb-5">
		URL
		<input type="url" v-model.trim="url" class="base-input rounded w-full" />
	</label>

	<alert v-if="!debouncedUrl" type="info" title="Tip">
		Before you can make a template, please fill the above input box with a link to an image to load as a base for the new meme template, for
		example:
		<NuxtLink
			to="https://cdn.skyra.pw/skyra-assets/avatars/rainbow.png"
			target="_blank"
			class="underline text-gray-800/80 dark:text-gray-200/80 inline-block"
		>
			https://cdn.skyra.pw/skyra-assets/avatars/rainbow.png
		</NuxtLink>
	</alert>
	<alert v-else-if="error || !imageData.src" type="danger" title="Error">
		{{ error ? 'The URL you have provided could not be loaded.' : 'The URL you have provided is not a valid image URL.' }}
	</alert>

	<label class="flex mb-5 items-center gap-2">
		Use number input instead of sliders:
		<input type="checkbox" :value="inputType === 'number'" @change.prevent="toggleInputType()" class="checkbox" />
	</label>

	<div class="grid grid-flow-row lg:grid-cols-[1fr_416px] xl:grid-cols-[1fr_416px_1fr] gap-4 mb-5 w-full justify-items-center">
		<canvas
			:width="width"
			height="400"
			ref="canvas"
			class="border-8 rounded-xl border-gray-200 bg-gray-300 dark:border-stone-900 dark:bg-stone-900 shadow-xl w-full max-w-fit"
			:class="isLoading ? 'animate-pulse' : ''"
			aria-label="Preview"
			role="figure"
		></canvas>

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:order-first w-full shadow-xl h-[70vh] max-h-[600px] min-h-[416px] overflow-y-auto">
			<div class="flex gap-2 items-center">
				<button
					@click="addBox"
					class="button success rounded w-8 h-8 p-0"
					aria-label="Add a new text box"
					title="Add a new text box"
					:disabled="!image"
				>
					<PlusIcon class="h-6 w-6 m-auto" />
				</button>
				<h2 class="text-3xl font-bold">Text Boxes</h2>
			</div>

			<div v-for="(box, index) of boxes" class="px-4 py-2 border-l-2 rounded shadow-sm mt-5" :class="classes[index % classes.length]">
				<h3 class="text-xl font-bold">Text #{{ index + 1 }}</h3>
				<div class="grid grid-cols-2 gap-2 mt-2">
					<input-slider name="X" v-model="box.x" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" v-model="box.y" :type="inputType" :min="0" :max="height" adornment="px" />
					<input-slider name="Width" v-model="box.width" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Height" v-model="box.height" :type="inputType" :min="0" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="box.rotation" :type="inputType" :min="-180" :max="180" adornment="º" />
				</div>

				<accordion class="bg-gray-300 dark:bg-stone-950 mt-2 rounded-xl" header="Details">
					<div class="grid grid-cols-2 gap-2 p-2 bg-gray-200 dark:bg-stone-900 rounded-xl">
						<label>
							Font
							<select v-model="box.modifiers.font" class="base-input select rounded w-full">
								<option value="impact">Impact</option>
								<option value="arial">Arial</option>
							</select>
						</label>

						<input-slider name="Size" v-model="box.modifiers.fontSize" :type="inputType" :min="1" :max="72" adornment="px" />

						<label>
							Outline Type
							<select v-model="box.modifiers.outlineType" class="base-input select rounded w-full">
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
							<select v-model="box.modifiers.textAlign" class="base-input select rounded w-full">
								<option value="left">Left</option>
								<option value="center">Center</option>
								<option value="right">Right</option>
							</select>
						</label>

						<label>
							Vertical Align
							<select v-model="box.modifiers.verticalAlign" class="base-input select rounded w-full">
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
								class="before:content-[':_'] before:font-medium before:not-italic opacity-80"
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

				<div class="flex mt-2">
					<button @click="boxes.splice(index, 1)" class="button danger p-2 rounded-xl w-full mt-auto">Remove</button>
				</div>
			</div>
		</div>

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:col-span-2 xl:col-auto w-full shadow-xl h-[70vh] max-h-[600px] min-h-[416px] overflow-y-auto">
			<h2 class="text-3xl font-bold">Avatars</h2>
			<div
				v-for="(key, index) of AvatarKeys"
				class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-rows-1 gap-5 mt-5"
				:class="classes[(index + 4) % classes.length]"
			>
				<div class="flex gap-2 items-center">
					<button
						@click="addPosition(key)"
						class="button success rounded w-8 h-8 p-0"
						aria-label="Add a new position to this avatar"
						title="Add a new position to this avatar"
						:disabled="!image"
					>
						<PlusIcon class="h-6 w-6 m-auto" />
					</button>
					<h3 class="text-2xl font-bold">{{ AvatarNames[index] }}</h3>
				</div>

				<div
					v-for="(position, index) of avatars[key]"
					class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-cols-2 gap-2"
					:class="classes[index % classes.length]"
				>
					<input-slider name="X" v-model="position.x" :type="inputType" :min="0" :max="width" adornment="px" />
					<input-slider name="Y" :type="inputType" v-model="position.y" :min="0" :max="height" adornment="px" />
					<input-slider name="Size" v-model="position.size" :type="inputType" :min="16" :max="height" adornment="px" />
					<input-slider name="Rotation" v-model="position.rotation" :type="inputType" :min="-180" :max="180" adornment="º" />

					<label>
						Style
						<select v-model="position.style" class="base-input select rounded w-full">
							<option value="circle">Circle</option>
							<option value="square">Square</option>
						</select>
					</label>

					<div class="flex">
						<button @click="avatars[key].splice(index, 1)" class="button danger p-2 rounded-xl w-full mt-auto">Remove</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="border border-gray-800 dark:border-stone-700 mt-10 mb-3" />

	<lazy-dialog-entry ref="dialog" @submit="replace" />
	<section class="flex gap-2 mb-4 justify-end">
		<button class="flex items-center gap-2 button" @click="copy(JSON.stringify({ name, url, avatars, boxes }, undefined, '\t'))">
			<template v-if="copied"><ClipboardDocumentCheckIcon class="w-5 h-5" />Copied</template>
			<template v-else><ClipboardDocumentIcon class="w-5 h-5" />Copy</template>
		</button>
		<button class="flex items-center gap-2 button" @click="dialog.showModal()"><ClipboardDocumentListIcon class="w-5 h-5" />Paste</button>
		<button class="flex items-center gap-2 button danger" @click="resetData"><TrashIcon class="w-5 h-5" />Reset</button>
		<button class="flex items-center gap-2 button success" @click="uploadData"><ArrowUpTrayIcon class="w-5 h-5" />Upload</button>
	</section>
	<codeblock :name="name" :url="url" :avatars="avatars" :boxes="boxes" />
</template>

<script setup lang="ts">
import {
	ArrowUpTrayIcon,
	ClipboardDocumentCheckIcon,
	ClipboardDocumentIcon,
	ClipboardDocumentListIcon,
	PlusIcon,
	TrashIcon
} from '@heroicons/vue/24/outline';
import { useImage, type UseImageOptions } from '@vueuse/core';
import { Canvas } from 'canvas-constructor/browser';
import type { Entry, EntryAvatarPosition, EntryBox } from '~/utils/transform/entry';

const dialog = ref<HTMLDialogElement>(null!);

const name = ref('');
const url = ref('');
const debouncedUrl = refDebounced(url, 500, { maxWait: 2000 });
const avatars = {
	author: reactive<EntryAvatarPosition[]>([]),
	target: reactive<EntryAvatarPosition[]>([])
};
const boxes = reactive<EntryBox[]>([]);

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
