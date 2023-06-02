<template>
	<span class="text-[#bc2b3d] dark:text-[#df6a73]">{{ addQuotes(value) }}</span>
</template>

<script setup lang="ts">
defineProps<{ value: string }>();
</script>
