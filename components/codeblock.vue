<template>
	<div class="codeblock" v-html="highlightedJson"></div>
</template>

<script setup lang="ts">
import { getHighlighter } from 'shiki-es';

const highlighter = await getHighlighter({ theme: 'one-dark-pro' });

const props = withDefaults(defineProps<{ data: object; language: string }>(), {
	language: 'json'
});

const highlightedJson = computed(() => highlighter.codeToHtml(JSON.stringify(props.data, null, '\t'), { lang: props.language }));
</script>
