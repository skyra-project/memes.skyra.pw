<template>
	<span class="text-[#915c00] dark:text-[#d19a66]">{{ value ? 'true' : 'false' }}</span>
</template>

<script setup lang="ts">
defineProps<{ value: boolean }>();
</script>
