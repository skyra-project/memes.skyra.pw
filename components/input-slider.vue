<template>
	<label>
		<span>{{ name }}</span>
		<template v-if="type === 'range'">
			<span role="status" class="opacity-80 before:content-[':_']">
				<slot name="header" :value="modelValue">{{ modelValue }}{{ adornment }}</slot>
			</span>
			<input
				v-bind="$attrs"
				type="range"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
				class="base-input w-full rounded"
			/>
		</template>
		<div v-else class="flex w-full items-center rounded border-2 border-gray-300 bg-gray-100 dark:border-stone-700 dark:bg-stone-900">
			<input
				v-bind="$attrs"
				type="number"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
				class="flex-1 bg-inherit p-2"
			/>
			<div v-if="adornment" class="opacity-0.7 flex-none pl-1 pr-2">{{ adornment }}</div>
		</div>
	</label>
</template>

<script lang="ts">
export default {
	inheritAttrs: false
};
</script>

<script setup lang="ts">
defineProps<{ name: string; modelValue: number; type: 'number' | 'range'; adornment?: string }>();
defineEmits<{
	(event: 'update:modelValue', value: number): void;
}>();
</script>
