<template>
	<div class="m-0.5 grid grid-cols-3 gap-0.5 rounded bg-gray-300 p-0.5 dark:bg-stone-700">
		<button v-uid ref="buttonAllCaps" role="checkbox" :aria-checked="allCaps" @click="$emit('update:allCaps', !allCaps)" class="rounded-l">
			<label :for="buttonAllCaps?.id">All Caps</label>
		</button>
		<button v-uid ref="buttonBold" role="checkbox" :aria-checked="bold" @click="$emit('update:bold', !bold)">
			<label :for="buttonBold?.id">Bold</label>
		</button>
		<button v-uid ref="buttonItalic" role="checkbox" :aria-checked="italic" @click="$emit('update:italic', !italic)" class="rounded-r">
			<label :for="buttonItalic?.id">Italic</label>
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{ allCaps: boolean; bold: boolean; italic: boolean }>();
defineEmits<{
	(event: 'update:allCaps', value: boolean): void;
	(event: 'update:bold', value: boolean): void;
	(event: 'update:italic', value: boolean): void;
}>();

const buttonAllCaps = ref<HTMLButtonElement>();
const buttonBold = ref<HTMLButtonElement>();
const buttonItalic = ref<HTMLButtonElement>();
</script>

<style scoped>
button {
	@apply bg-gray-100 p-2 hover:bg-gray-200 dark:bg-stone-900 hover:dark:bg-stone-600;
}

button[aria-checked='true'] {
	@apply bg-stone-300 hover:bg-stone-200 dark:bg-stone-700 hover:dark:bg-stone-600;
}

button > label {
	@apply pointer-events-none;
}
</style>
