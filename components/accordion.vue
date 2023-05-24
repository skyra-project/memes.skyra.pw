<template>
	<div v-bind="$attrs">
		<button class="w-full p-2 rounded-xl" @click="toggle()" role="heading" :aria-level="level ?? 3">
			<slot name="header">{{ header ?? 'Accordion' }}</slot>
		</button>
		<transition name="accordion" @before-enter="transitionClose" @enter="transitionOpen" @before-leave="transitionOpen" @leave="transitionClose">
			<div v-show="show" class="px-1 pb-1" :aria-expanded="show">
				<slot></slot>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
defineProps<{ header?: string; level?: number }>();

const [show, toggle] = useToggle(false);

function transitionOpen(element: Element) {
	(element as HTMLElement).style.height = `${element.scrollHeight}px`;
}

function transitionClose(element: Element) {
	(element as HTMLElement).style.height = '0px';
}
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
	will-change: height;
	transition: height 0.3s ease;
	overflow: hidden;
}
</style>
