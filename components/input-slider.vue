<template>
	<label>
		{{ name
		}}<span role="status" class="before:content-[':_'] opacity-80" :aria-hidden="type === 'number'" v-show="type === 'range'">
			<slot name="header" :value="modelValue">{{ modelValue }}</slot>
		</span>
		<input
			v-bind="$attrs"
			:type="type"
			:value="modelValue"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)"
			class="base-input range w-full"
		/>
	</label>
</template>

<script lang="ts">
export default {
	inheritAttrs: false
};
</script>

<script setup lang="ts">
defineProps<{ name: string; modelValue: number; type: 'number' | 'range' }>();
defineEmits<{
	(event: 'update:modelValue', value: number): void;
}>();
</script>
