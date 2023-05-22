<template>
	<pre class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl h-[50vh] overflow-y-auto" role="status">
		<code>
{{formattedJson}}
		</code>
	</pre>
</template>

<script setup lang="ts">
const props = defineProps<{ data: object }>();

const formattedJson = computed(() => JSON.stringify(props.data, null, '\t'));
</script>
