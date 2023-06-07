<template>
	<div>
		<div class="flex items-center">
			<label v-uid ref="label">{{ name }}</label>
			<span class="mr-1">:</span>
			<input
				v-bind="$attrs"
				type="number"
				ref="input"
				aria-keyshortcuts="0 1 2 3 4 5 6 7 8 9 Backspace"
				:aria-labelledby="label?.id"
				:value="modelValue"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
				@keydown="keyDownInput"
				class="w-full bg-inherit opacity-80 outline-none hover:text-blue-700 focus:text-blue-700 hover:dark:text-blue-400 focus:dark:text-blue-400"
			/>
			<div v-if="adornment">{{ adornment }}</div>
		</div>
		<input
			v-bind="$attrs"
			type="range"
			ref="slider"
			aria-keyshortcuts="ArrowRight ArrowLeft ArrowUp ArrowDown"
			:aria-labelledby="label?.id"
			:value="modelValue"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
			@keydown="keyDownSlider"
			class="base-input w-full rounded"
		/>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false
};
</script>

<script setup lang="ts">
defineProps<{ name: string; modelValue: number; adornment?: string }>();
defineEmits<{
	(event: 'update:modelValue', value: number): void;
}>();

const label = ref<HTMLLabelElement>();
const input = ref<HTMLInputElement>(null!);
const slider = ref<HTMLInputElement>(null!);

function keyDownInput(_event: Event) {
	const event = _event as KeyboardEvent;
	switch (event.key) {
		case 'ArrowLeft':
		case 'ArrowRight':
			slider.value.focus();
			break;
	}
}

function keyDownSlider(_event: Event) {
	const event = _event as KeyboardEvent;
	if (event.key >= '0' && event.key <= '9') {
		input.value.value = '';
		input.value.focus();
	} else if (event.key === 'Backspace') {
		input.value.focus();
	}
}
</script>

<style scoped>
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
	display: none;
}

input[type='number'] {
	appearance: textfield;
}
</style>
