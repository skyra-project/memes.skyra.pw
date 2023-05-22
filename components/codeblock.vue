<template>
	<pre class="p-5 bg-gray-200 dark:bg-stone-900 rounded-xl h-[50vh] overflow-y-auto" role="status"><render-json /></pre>
</template>

<script setup lang="tsx">
import type { EntryAvatarPosition, EntryBox } from '~/lib/interfaces';

const props = defineProps<{
	name: string;
	url: string;
	avatars: { author: readonly EntryAvatarPosition[]; target: readonly EntryAvatarPosition[] };
	boxes: readonly EntryBox[];
}>();

function line(indent: number, ...elements: readonly (JSX.Element | string)[]) {
	return (
		<span class="block">
			{'\t'.repeat(indent)}
			{elements}
		</span>
	);
}

function property(name: string) {
	return <span class="text-teal-600 dark:text-teal-400">"{name}"</span>;
}

function string(value: string) {
	return <span class="text-green-600 dark:text-green-400">"{value}"</span>;
}

function number(value: number) {
	return <span class="text-amber-600 dark:text-amber-400">{value}</span>;
}

function boolean(value: boolean) {
	return <span class="text-rose-600 dark:text-rose-400">{value ? 'true' : 'false'}</span>;
}

function addAvatar(lines: JSX.Element[], position: EntryAvatarPosition, last: boolean) {
	lines.push(line(3, '{'));
	lines.push(line(4, property('x'), ': ', number(position.x), ','));
	lines.push(line(4, property('y'), ': ', number(position.y), ','));
	lines.push(line(4, property('size'), ': ', number(position.size), ','));
	lines.push(line(4, property('style'), ': ', string(position.style), ','));
	lines.push(line(4, property('rotation'), ': ', number(position.rotation)));
	lines.push(line(3, last ? '}' : '},'));
}

function addAvatars(lines: JSX.Element[], positions: readonly EntryAvatarPosition[]) {
	for (let i = 0, l = positions.length - 1; i < positions.length; ++i) {
		addAvatar(lines, positions[i], i === l);
	}
}

function addBox(lines: JSX.Element[], box: EntryBox, last: boolean) {
	lines.push(line(2, '{'));
	lines.push(line(3, property('x'), ': ', number(box.x), ','));
	lines.push(line(3, property('y'), ': ', number(box.y), ','));
	lines.push(line(3, property('width'), ': ', number(box.width), ','));
	lines.push(line(3, property('height'), ': ', number(box.height), ','));
	lines.push(line(3, property('rotation'), ': ', number(box.rotation), ','));
	lines.push(line(3, property('modifiers'), ': {'));
	lines.push(line(4, property('font'), ': ', string(box.modifiers.font), ','));
	lines.push(line(4, property('fontSize'), ': ', number(box.modifiers.fontSize), ','));
	lines.push(line(4, property('allCaps'), ': ', boolean(box.modifiers.allCaps), ','));
	lines.push(line(4, property('bold'), ': ', boolean(box.modifiers.bold), ','));
	lines.push(line(4, property('italic'), ': ', boolean(box.modifiers.italic), ','));
	lines.push(line(4, property('outlineType'), ': ', string(box.modifiers.outlineType), ','));
	lines.push(line(4, property('outlineWidth'), ': ', number(box.modifiers.outlineWidth), ','));
	lines.push(line(4, property('textAlign'), ': ', string(box.modifiers.textAlign), ','));
	lines.push(line(4, property('verticalAlign'), ': ', string(box.modifiers.verticalAlign), ','));
	lines.push(line(4, property('opacity'), ': ', number(box.modifiers.opacity)));
	lines.push(line(3, '}'));
	lines.push(line(2, last ? '}' : '},'));
}

function addBoxes(lines: JSX.Element[], boxes: readonly EntryBox[]) {
	for (let i = 0, l = boxes.length - 1; i < boxes.length; ++i) {
		addBox(lines, boxes[i], i === l);
	}
}

function renderJson() {
	const lines = [
		line(0, '{'),
		line(1, property('name'), ': ', string(props.name), ','),
		line(1, property('url'), ': ', string(props.url), ','),
		line(1, property('avatars'), ': {')
	];

	if (props.avatars.author.length === 0) {
		lines.push(line(2, property('author'), ': [],'));
	} else {
		lines.push(line(2, property('author'), ': ['));
		addAvatars(lines, props.avatars.author);
		lines.push(line(2, '],'));
	}

	if (props.avatars.target.length === 0) {
		lines.push(line(2, property('target'), ': []'));
	} else {
		lines.push(line(2, property('target'), ': []'));
		addAvatars(lines, props.avatars.target);
		lines.push(line(2, ']'));
	}

	lines.push(line(1, '}'));

	if (props.boxes.length === 0) {
		lines.push(line(1, property('boxes'), ': []'));
	} else {
		lines.push(line(1, property('boxes'), ': ['));
		addBoxes(lines, props.boxes);
		lines.push(line(1, ']'));
	}

	lines.push(line(0, '}'));
	return (
		<code>
			<client-only>{lines}</client-only>
		</code>
	);
}
</script>
