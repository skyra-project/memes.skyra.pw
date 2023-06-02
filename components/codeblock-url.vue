<template>
	<codeblock-string v-if="url" :value="value">"<nuxt-link :to="url" class="underline" v-text="url" />"</codeblock-string>
	<codeblock-string v-else :value="value" />
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>();
const url = computed(() => {
	try {
		return new URL(props.value).href;
	} catch {
		return null;
	}
});
</script>
