<template>
	<label>
		{{ name }}
		<input
			type="color"
			:value="modelValue"
			@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			class="mt-0.5 h-10 w-full rounded bg-gray-100 p-1.5 outline outline-2 outline-gray-300 focus-visible:outline-current dark:bg-stone-900 dark:outline-stone-700"
		/>
	</label>
</template>

<script setup lang="ts">
defineProps<{ name: string; modelValue: `#${string}` }>();
defineEmits<{
	(event: 'update:modelValue', value: `#${string}`): void;
}>();
</script>

<style scoped>
input[type='color']::-moz-color-swatch {
	@apply rounded border-none p-0;
}

input[type='color']::-webkit-color-swatch-wrapper {
	@apply p-0;
}

input[type='color']::-webkit-color-swatch {
	@apply rounded border-none;
}
</style>
