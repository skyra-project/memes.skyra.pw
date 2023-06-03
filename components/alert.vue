<template>
	<div class="mb-4 mt-6" role="alert" v-show="visible">
		<div class="relative flex">
			<p class="p-4"><slot /></p>
			<button v-if="closable" class="my-auto ml-auto mr-2 rounded-lg hover:bg-red-600 hover:dark:bg-red-700" @click.prevent="visible = false">
				<XMarkIcon class="m-2 h-5 w-5" aria-label="Close" />
			</button>
			<div class="pointer-events-none absolute flex h-full w-full">
				<div class="w-4 shrink-0 rounded-bl-md rounded-tl-md border-b-2 border-l-2 border-t-2" :class="border"></div>
				<div class="relative border-b-2" :class="border">
					<div class="pointer-events-auto flex -translate-y-1/2 place-items-center gap-2 px-2" :class="text">
						<icon class="h-5 w-5" :aria-label="label" />
						<span v-if="title" class="font-semibold">{{ title }}</span>
					</div>
				</div>
				<div class="flex-1 rounded-br-md rounded-tr-md border-b-2 border-r-2 border-t-2" :class="border"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{ type: 'info' | 'success' | 'warning' | 'danger'; title?: string; closable?: boolean }>();
const visible = ref(true);

const types = {
	info: {
		text: 'text-blue-500 dark:text-blue-400',
		border: 'border-blue-500 dark:border-blue-400',
		icon: InformationCircleIcon,
		label: 'Information Icon'
	},
	success: {
		text: 'text-green-500',
		border: 'border-green-500',
		icon: CheckIcon,
		label: 'Check Icon'
	},
	warning: {
		text: 'text-yellow-500',
		border: 'border-yellow-500',
		icon: ExclamationTriangleIcon,
		label: 'Exclamation Triangle Icon'
	},
	danger: {
		text: 'text-red-500 dark:text-red-400',
		border: 'border-red-500 dark:border-red-400',
		icon: ExclamationTriangleIcon,
		label: 'Exclamation Triangle Icon'
	}
} as const;

const text = computed(() => types[props.type].text);
const border = computed(() => types[props.type].border);
const icon = computed(() => types[props.type].icon);
const label = computed(() => types[props.type].label);
</script>
