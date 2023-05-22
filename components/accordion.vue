<template>
	<div v-bind="$attrs">
		<button class="w-full" @click="toggle()">
			<slot name="header">Accordion</slot>
		</button>
		<transition name="accordion" @before-enter="transitionClose" @enter="transitionOpen" @before-leave="transitionOpen" @leave="transitionClose">
			<div v-show="show">
				<slot></slot>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
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
