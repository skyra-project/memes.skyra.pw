<template>
	<label>
		<span>{{ name }}</span>
		<template v-if="type === 'range'">
			<span role="status" class="before:content-[':_'] opacity-80">
				<slot name="header" :value="modelValue">{{ modelValue }}{{ adornment }}</slot>
			</span>
			<input
				v-bind="$attrs"
				type="range"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
				class="base-input rounded w-full"
			/>
		</template>
		<div v-else class="flex bg-gray-100 dark:bg-stone-900 border-2 border-gray-300 dark:border-stone-700 rounded w-full items-center">
			<input
				v-bind="$attrs"
				type="number"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
				class="bg-inherit p-2 flex-1"
			/>
			<div v-if="adornment" class="flex-none pl-1 pr-2 opacity-0.7">{{ adornment }}</div>
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
