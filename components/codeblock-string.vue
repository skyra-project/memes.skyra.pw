<template>
	<span class="text-[#457400] dark:text-[#98c379]"><slot>{{ addQuotes(value) }}</slot></span>
</template>

<script setup lang="ts">
defineProps<{ value: string }>();
</script>
