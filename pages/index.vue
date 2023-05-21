<template>
	<div>
		<label class="block mb-5">
			<span>Name</span>
			<input type="text" v-model.trim="name" class="base-input rounded w-full" />
		</label>

		<label class="block mb-5">
			<span>URL</span>
			<input type="url" v-model.trim="url" class="base-input rounded w-full" />
		</label>

		<label class="flex mb-5 items-center gap-2">
			<span>Use number input instead of sliders:</span>
			<input type="checkbox" :value="inputType === 'number'" @change.prevent="toggleInputType()" class="checkbox" />
		</label>
	</div>

	<div v-if="!debouncedUrl" class="mb-4 flex rounded-lg bg-opacity-25 p-4 text-sm bg-yellow-500" role="alert">
		<svg
			class="mr-3 inline h-5 w-5 flex-shrink-0 dark:text-stone-50 text-yellow-600"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
				clip-rule="evenodd"
			></path>
		</svg>
		<span>
			Please fill the above input box with a link to an image to load as a base for the new meme template, for example,
			<NuxtLink href="https://skyra.pw/avatars/skyra.png" target="_blank" class="underline opacity-80">
				https://skyra.pw/avatars/skyra.png</NuxtLink
			>.
		</span>
	</div>
	<div v-else-if="error || !imageData.src" class="mb-4 flex rounded-lg bg-opacity-25 p-4 text-sm bg-red-500" role="alert">
		<svg
			class="mr-3 inline h-5 w-5 flex-shrink-0 dark:text-stone-50 text-red-600"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
				clip-rule="evenodd"
			></path>
		</svg>
		<span>
			{{ error ? 'The URL you have provided could not be loaded.' : 'The URL you have provided is not a valid image URL.' }}
		</span>
	</div>

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

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:order-first w-full shadow-xl max-h-[70vh] overflow-y-auto">
			<div class="flex gap-2">
				<button @click="addBox" class="success rounded px-3" aria-label="Add a new box" :disabled="image === null">+</button>
				<h2 class="text-3xl font-bold">Text Boxes</h2>
			</div>

			<div v-for="(box, index) of boxes" class="px-4 py-2 border-l-2 rounded shadow-sm mt-5" :class="classes[index % classes.length]">
				<h3 class="text-xl font-bold">Text #{{ index + 1 }}</h3>
				<div class="grid grid-cols-2 gap-2 mt-2">
					<label>
						<span>
							X<span class="status" role="status">: {{ box.x }}px</span>
						</span>
						<input :type="inputType" min="0" :max="width" v-model.number="box.x" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Y<span class="status" role="status">: {{ box.y }}px</span>
						</span>
						<input :type="inputType" min="0" :max="height" v-model.number="box.y" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Width<span class="status" role="status">: {{ box.width }}px</span>
						</span>
						<input :type="inputType" min="20" :max="width" v-model.number="box.width" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Height<span class="status" role="status">: {{ box.height }}px</span>
						</span>
						<input :type="inputType" min="20" :max="height" v-model.number="box.height" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Rotation<span class="status" role="status">: {{ box.rotation }}º</span>
						</span>
						<input :type="inputType" min="-180" max="180" v-model.number="box.rotation" class="base-input range w-full" />
					</label>

					<div></div>

					<label>
						<span>Font</span>
						<select v-model="box.modifiers.font" class="base-input select rounded w-full">
							<option value="impact">Impact</option>
							<option value="arial">Arial</option>
						</select>
					</label>

					<label>
						<span>
							Font Size<span class="status" role="status">: {{ box.modifiers.fontSize }}px</span>
						</span>
						<input :type="inputType" min="1" max="72" v-model.number="box.modifiers.fontSize" class="base-input range w-full" />
					</label>

					<label>
						<span>Outline Type</span>
						<select v-model="box.modifiers.outlineType" class="base-input select rounded w-full">
							<option value="outline">Outline</option>
							<option value="shadow">Shadow</option>
							<option value="none">None</option>
						</select>
					</label>

					<label>
						<span>
							Outline Width<span class="status" role="status">: {{ box.modifiers.outlineWidth }}px</span>
						</span>
						<input
							:type="inputType"
							min="0"
							max="4"
							step="0.25"
							v-model.number="box.modifiers.outlineWidth"
							:disabled="box.modifiers.outlineType === 'none'"
							class="base-input range w-full"
						/>
					</label>

					<label>
						<span>Text Align</span>
						<select v-model="box.modifiers.textAlign" class="base-input select rounded w-full">
							<option value="left">Left</option>
							<option value="center">Center</option>
							<option value="right">Right</option>
						</select>
					</label>

					<label>
						<span>Vertical Align</span>
						<select v-model="box.modifiers.verticalAlign" class="base-input select rounded w-full">
							<option value="top">Top</option>
							<option value="middle">Middle</option>
							<option value="bottom">Bottom</option>
						</select>
					</label>

					<div>
						Modifiers<span class="status"
							>:
							<span
								:class="{
									uppercase: box.modifiers.allCaps,
									italic: box.modifiers.italic,
									'font-extrabold': box.modifiers.bold
								}"
								>Ab</span
							></span
						>
						<label class="flex items-center gap-2">
							<input type="checkbox" v-model="box.modifiers.allCaps" class="checkbox" />
							<span>All Caps</span>
						</label>

						<label class="flex items-center gap-2">
							<input type="checkbox" v-model="box.modifiers.bold" class="checkbox" />
							<span>Bold</span>
						</label>

						<label class="flex items-center gap-2">
							<input type="checkbox" v-model="box.modifiers.italic" class="checkbox" />
							<span>Italic</span>
						</label>
					</div>

					<label>
						<span>
							Opacity<span class="status" role="status">: {{ Math.round(box.modifiers.opacity * 100) }}%</span>
						</span>
						<input :type="inputType" min="0" max="1" step="0.01" v-model.number="box.modifiers.opacity" class="base-input range w-full" />
					</label>
				</div>

				<div class="flex mt-2">
					<button @click="boxes.splice(index, 1)" class="danger p-2 rounded-xl w-full mt-auto">Remove</button>
				</div>
			</div>
		</div>

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:col-span-2 xl:col-auto w-full shadow-xl max-h-[70vh] overflow-y-auto">
			<h2 class="text-3xl font-bold">Avatars</h2>
			<div
				v-for="(key, index) of AvatarKeys"
				class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-rows-1 gap-5 mt-5"
				:class="classes[(index + 4) % classes.length]"
			>
				<div class="flex gap-2">
					<button
						@click="addPosition(key)"
						class="success rounded px-3"
						aria-label="Add a new position to this avatar"
						:disabled="image === null"
					>
						+
					</button>
					<h3 class="text-2xl font-bold">{{ AvatarNames[index] }}</h3>
				</div>

				<div
					v-for="(position, index) of avatars[key]"
					class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-cols-2 gap-2"
					:class="classes[index % classes.length]"
				>
					<label>
						<span>
							X<span class="status" role="status">: {{ position.x }}px</span>
						</span>
						<input :type="inputType" min="0" :max="width" v-model.number="position.x" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Y<span class="status" role="status">: {{ position.y }}px</span>
						</span>
						<input :type="inputType" min="0" :max="height" v-model.number="position.y" class="base-input range w-full" />
					</label>

					<label>
						<span>
							Size<span class="status" role="status">: {{ position.size }}px</span>
						</span>
						<input :type="inputType" min="16" :max="height" v-model.number="position.size" class="base-input range w-full" />
					</label>

					<label>
						<span>Style</span>
						<select v-model="position.style" class="base-input select rounded w-full">
							<option value="circle">Circle</option>
							<option value="square">Square</option>
						</select>
					</label>

					<label>
						<span>
							Rotation<span class="status" role="status">: {{ position.rotation }}º</span>
						</span>
						<input :type="inputType" min="-180" max="180" v-model.number="position.rotation" class="base-input range w-full" />
					</label>

					<div class="flex">
						<button @click="avatars[key].splice(index, 1)" class="danger p-2 rounded-xl w-full mt-auto">Remove</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="json-divider" />
	<pre class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl h-[50vh] overflow-y-auto" role="status">{{
		JSON.stringify({ name, url, avatars, boxes }, null, '\t')
	}}</pre>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core';
import { Canvas } from 'canvas-constructor/browser';

const name = ref('');
const url = ref('');
const debouncedUrl = refDebounced(url, 500);
const avatars = {
	author: reactive<EntryAvatarPosition[]>([]),
	target: reactive<EntryAvatarPosition[]>([])
};
const boxes = reactive<EntryBox[]>([]);

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

const imageData = reactive({ src: '' });
const { isLoading, error, state: image, execute } = useImage(imageData, { immediate: false });
watch(debouncedUrl, async (value) => {
	try {
		imageData.src = new URL(value).href;
		await execute();
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
			opacity: 1
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

interface EntryBox {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	modifiers: EntryBoxModifiers;
}

interface EntryBoxModifiers {
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

interface EntryAvatarPosition {
	x: number;
	y: number;
	size: number;
	style: 'circle' | 'square';
	rotation: number;
}
</script>

<style scoped>
hr.json-divider {
	@apply border-0 border-t-2 text-gray-800 dark:text-gray-200 overflow-visible text-center h-1 py-1 mt-10 mb-3;
}

hr.json-divider:after {
	@apply bg-gray-50 dark:bg-stone-800 px-1 relative -top-5 text-2xl;
	content: 'JSON';
}

button.success {
	@apply bg-green-500 disabled:bg-green-100 dark:bg-green-700 disabled:dark:bg-green-900;
}

button.danger {
	@apply text-gray-50 bg-red-600 dark:bg-red-700;
}

.base-input {
	@apply border-2 p-2 bg-gray-100 border-gray-300 dark:border-stone-700 dark:bg-stone-900 dark:[color-scheme:dark];
}

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

input.range {
	@apply rounded dark:[color-scheme:dark];
}

input.checkbox {
	@apply dark:[color-scheme:dark];
}

span.status {
	@apply text-stone-600 dark:text-stone-400;
}
</style>
