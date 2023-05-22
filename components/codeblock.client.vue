<template>
	<div class="codeblock" v-html="highlightedJson"></div>
</template>

<script setup lang="ts">
import { getHighlighter } from 'shiki-es';

const highlighter = await getHighlighter({ theme: 'one-dark-pro' });

const props = defineProps<{ data: object }>();

const highlightedJson = computed(() => highlighter.codeToHtml(JSON.stringify(props.data, null, '\t'), { lang: 'json' }));
</script>
