<template>
	<div class="mb-4 mt-6" role="alert" v-show="visible">
		<div class="relative flex">
			<p class="p-4"><slot /></p>
			<button v-if="closable" class="ml-auto my-auto mr-2 rounded-lg hover:bg-red-600 hover:dark:bg-red-700" @click.prevent="visible = false">
				<XMarkIcon class="w-5 h-5 m-2" aria-label="Close" />
			</button>
			<div class="pointer-events-none absolute h-full w-full flex">
				<div class="rounded-tl-md rounded-bl-md w-4 shrink-0 border-b-2 border-l-2 border-t-2" :class="border"></div>
				<div class="relative border-b-2" :class="border">
					<div class="-translate-y-1/2 pointer-events-auto flex place-items-center gap-2 px-2" :class="text">
						<icon class="w-5 h-5" :aria-label="label" />
						<span v-if="title" class="font-semibold">{{ title }}</span>
					</div>
				</div>
				<div class="rounded-tr-md rounded-br-md flex-1 border-b-2 border-r-2 border-t-2" :class="border"></div>
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
