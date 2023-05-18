<template>
	<div>
		<label class="block mb-5">
			<span>Name</span>
			<input type="text" v-model="name" class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded" />
		</label>

		<label class="block mb-5">
			<span>URL</span>
			<input type="url" v-model="url" class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded" />
		</label>
	</div>

	<div class="grid grid-flow-row lg:grid-cols-[1fr_416px] xl:grid-cols-[1fr_416px_1fr] gap-4 mb-5 w-full justify-items-center">
		<canvas
			width="400"
			height="400"
			ref="canvas"
			class="border-8 rounded-xl border-gray-200 bg-gray-300 dark:border-stone-900 dark:bg-stone-900 shadow-xl"
			aria-label="Preview"
			role="figure"
		></canvas>

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:order-first w-full shadow-xl max-h-[70vh] overflow-y-auto">
			<div class="flex gap-2">
				<button @click="addBox" class="bg-green-500 dark:bg-green-700 px-3 rounded" aria-label="Add a new box">+</button>
				<h2 class="text-3xl font-bold">Boxes</h2>
			</div>

			<div
				v-for="(box, index) of boxes"
				class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-cols-2 gap-2 mt-5"
				:class="classes[index % classes.length]"
			>
				<label>
					<span>
						X<span class="text-stone-600 dark:text-stone-400" role="status">: {{ box.x }}px</span>
					</span>
					<input
						type="range"
						min="0"
						max="400"
						v-model="box.x"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					/>
				</label>

				<label>
					<span>
						Y<span class="text-stone-600 dark:text-stone-400" role="status">: {{ box.y }}px</span>
					</span>
					<input
						type="range"
						min="0"
						max="400"
						v-model="box.y"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					/>
				</label>

				<label>
					<span>
						Width<span class="text-stone-600 dark:text-stone-400" role="status">: {{ box.width }}px</span>
					</span>
					<input
						type="range"
						min="20"
						max="400"
						v-model="box.width"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					/>
				</label>

				<label>
					<span>
						Height<span class="text-stone-600 dark:text-stone-400" role="status">: {{ box.height }}px</span>
					</span>
					<input
						type="range"
						min="20"
						max="400"
						v-model="box.height"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					/>
				</label>

				<label>
					<span>
						Rotation<span class="text-stone-600 dark:text-stone-400" role="status">: {{ box.rotation }}º</span>
					</span>
					<input
						type="range"
						min="-180"
						max="180"
						v-model="box.rotation"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					/>
				</label>

				<div class="flex">
					<button @click="boxes.splice(index, 1)" class="text-gray-50 bg-red-600 dark:bg-red-700 p-2 rounded-xl w-full mt-auto">
						Remove
					</button>
				</div>
			</div>
		</div>

		<div class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl lg:col-span-2 xl:col-auto w-full shadow-xl max-h-[70vh] overflow-y-auto">
			<div class="flex gap-2">
				<button @click="addAvatar" class="bg-green-500 dark:bg-green-700 px-3 rounded" aria-label="Add a new avatar">+</button>
				<h2 class="text-3xl font-bold">Avatars</h2>
			</div>
			<div
				v-for="(avatar, index) of avatars"
				class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-rows-1 gap-5 mt-5"
				:class="classes[(index + 4) % classes.length]"
			>
				<label>
					<span>User</span>
					<select
						v-model="avatar.user"
						class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
					>
						<option value="author">Author</option>
						<option value="target">Target</option>
					</select>
				</label>

				<div>
					<div class="flex gap-2">
						<button
							@click="addPosition(avatar)"
							class="bg-green-500 dark:bg-green-700 px-3 rounded"
							aria-label="Add a new position to this avatar"
						>
							+
						</button>
						<h3 class="text-2xl font-bold">Positions</h3>
					</div>
					<div
						v-for="(position, index) of avatar.positions"
						class="px-4 py-2 border-l-2 rounded shadow-sm grid grid-cols-2 gap-2 mt-3"
						:class="classes[index % classes.length]"
					>
						<label>
							<span>
								X<span class="text-stone-600 dark:text-stone-400" role="status">: {{ position.x }}px</span>
							</span>
							<input
								type="range"
								min="0"
								max="400"
								v-model="position.x"
								class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
							/>
						</label>

						<label>
							<span>
								Y<span class="text-stone-600 dark:text-stone-400" role="status">: {{ position.y }}px</span>
							</span>
							<input
								type="range"
								min="0"
								max="400"
								v-model="position.y"
								class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
							/>
						</label>

						<label>
							<span>
								Size<span class="text-stone-600 dark:text-stone-400" role="status">: {{ position.size }}px</span>
							</span>
							<input
								type="range"
								min="16"
								max="400"
								v-model="position.size"
								class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
							/>
						</label>

						<label>
							<span>Style</span>
							<select
								v-model="position.style"
								class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
							>
								<option value="circle">Circle</option>
								<option value="square">Square</option>
							</select>
						</label>

						<label>
							<span>
								Rotation<span class="text-stone-600 dark:text-stone-400" role="status">: {{ position.rotation }}º</span>
							</span>
							<input
								type="range"
								min="-180"
								max="180"
								v-model="position.rotation"
								class="form-input border-gray-300 dark:border-stone-700 bg-gray-100 dark:bg-stone-800 w-full rounded"
							/>
						</label>

						<div class="flex">
							<button
								@click="avatar.positions.splice(index, 1)"
								class="text-gray-50 bg-red-600 dark:bg-red-700 p-2 rounded-xl w-full mt-auto"
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<hr class="json-divider">
	<pre class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl h-[50vh] overflow-y-auto" role="status">{{ { name, url, avatars, boxes } }}</pre>
</template>

<script setup lang="ts">
import { Canvas, loadImage } from 'canvas-constructor/browser';

const name = ref('');
const url = ref('');
const avatars = reactive<EntryAvatar[]>([]);
const boxes = reactive<EntryBox[]>([]);

const canvas = ref<HTMLCanvasElement>(null!);
const constructor = computed(() => (canvas.value ? new Canvas(canvas.value) : null));
const image = ref<HTMLImageElement | null>(null);
watch(
	url,
	async (value) => {
		try {
			image.value = await loadImage(new URL(value).href);
			printImage();
		} catch {
			image.value = null;
			constructor.value?.clearRectangle();
		}
	},
	{ immediate: true }
);

watch([boxes, avatars], () => printImage());

function addBox() {
	boxes.push({ x: 200, y: boxes.length === 0 ? 50 : 350, width: 400, height: 100, rotation: 0 });
}

function addAvatar() {
	avatars.push({ user: 'author', positions: [{ x: 50, y: 50, size: 100, style: 'circle', rotation: 0 }] });
}

function addPosition(avatar: EntryAvatar) {
	avatar.positions.push({ x: 50, y: 50, size: 100, style: 'circle', rotation: 0 });
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

function printImage() {
	const cc = constructor.value;
	if (!cc) return;

	const img = image.value;
	if (!img) return;

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
	for (const avatar of avatars) {
		for (const position of avatar.positions) {
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
}

interface EntryAvatar {
	user: 'author' | 'target';
	positions: EntryAvatarPosition[];
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
</style>
