<template>
	<pre class="max-h-[50vh] overflow-auto rounded-xl bg-gray-200 p-5 dark:bg-stone-900" role="status"><render-json /></pre>
</template>

<script setup lang="tsx">
import type { EntryAvatarPosition, EntryBox } from '~/utils/transform/entry';

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
	return <codeblock-property value={name} />;
}

function string(value: string) {
	return <codeblock-string value={value} />;
}

function number(value: number) {
	return <codeblock-number value={value} />;
}

function boolean(value: boolean) {
	return <codeblock-boolean value={value} />;
}

const colours = ['text-[#915c00] dark:text-[#d19a66]', 'text-[#a626a4] dark:text-[#c678dd]', 'text-[#00737d] dark:text-[#56b6c2]'];
function brace(level: number, value: '{' | '{}' | '}' | '[' | '[]' | ']') {
	return <span class={colours[level % colours.length]}>{value}</span>;
}

function addAvatar(lines: JSX.Element[], position: EntryAvatarPosition, last: boolean) {
	lines.push(line(3, brace(3, '{')));
	lines.push(line(4, property('x'), ': ', number(position.x), ','));
	lines.push(line(4, property('y'), ': ', number(position.y), ','));
	lines.push(line(4, property('size'), ': ', number(position.size), ','));
	lines.push(line(4, property('style'), ': ', string(position.style), ','));
	lines.push(line(4, property('rotation'), ': ', number(position.rotation)));
	lines.push(line(3, ...(last ? [brace(3, '}')] : [brace(3, '}'), ','])));
}

function addAvatars(lines: JSX.Element[], positions: readonly EntryAvatarPosition[]) {
	for (let i = 0, l = positions.length - 1; i < positions.length; ++i) {
		addAvatar(lines, positions[i], i === l);
	}
}

function addBox(lines: JSX.Element[], box: EntryBox, last: boolean) {
	lines.push(line(2, brace(2, '{')));
	lines.push(line(3, property('x'), ': ', number(box.x), ','));
	lines.push(line(3, property('y'), ': ', number(box.y), ','));
	lines.push(line(3, property('width'), ': ', number(box.width), ','));
	lines.push(line(3, property('height'), ': ', number(box.height), ','));
	lines.push(line(3, property('rotation'), ': ', number(box.rotation), ','));
	lines.push(line(3, property('textColor'), ': ', string(box.textColor), ','));
	lines.push(line(3, property('modifiers'), ': ', brace(3, '{')));
	lines.push(line(4, property('font'), ': ', string(box.modifiers.font), ','));
	lines.push(line(4, property('fontSize'), ': ', number(box.modifiers.fontSize), ','));
	lines.push(line(4, property('allCaps'), ': ', boolean(box.modifiers.allCaps), ','));
	lines.push(line(4, property('bold'), ': ', boolean(box.modifiers.bold), ','));
	lines.push(line(4, property('italic'), ': ', boolean(box.modifiers.italic), ','));
	lines.push(line(4, property('outlineType'), ': ', string(box.modifiers.outlineType), ','));
	lines.push(line(4, property('outlineWidth'), ': ', number(box.modifiers.outlineWidth), ','));
	lines.push(line(4, property('outlineColor'), ': ', string(box.modifiers.outlineColor), ','));
	lines.push(line(4, property('textAlign'), ': ', string(box.modifiers.textAlign), ','));
	lines.push(line(4, property('verticalAlign'), ': ', string(box.modifiers.verticalAlign), ','));
	lines.push(line(4, property('opacity'), ': ', number(box.modifiers.opacity / 100)));
	lines.push(line(3, brace(3, '}')));
	lines.push(line(2, ...(last ? [brace(2, '}')] : [brace(2, '}'), ','])));
}

function addBoxes(lines: JSX.Element[], boxes: readonly EntryBox[]) {
	for (let i = 0, l = boxes.length - 1; i < boxes.length; ++i) {
		addBox(lines, boxes[i], i === l);
	}
}

function renderJson() {
	const lines = [
		line(0, brace(0, '{')),
		line(1, property('name'), ': ', string(props.name), ','),
		line(1, property('url'), ': ', <codeblock-url value={props.url} />, ','),
		line(1, property('avatars'), ': ', brace(1, '{'))
	];

	if (props.avatars.author.length === 0) {
		lines.push(line(2, property('author'), ': ', brace(2, '[]'), ','));
	} else {
		lines.push(line(2, property('author'), ': ', brace(2, '[')));
		addAvatars(lines, props.avatars.author);
		lines.push(line(2, brace(2, ']'), ','));
	}

	if (props.avatars.target.length === 0) {
		lines.push(line(2, property('target'), ': ', brace(2, '[]')));
	} else {
		lines.push(line(2, property('target'), ': ', brace(2, '[')));
		addAvatars(lines, props.avatars.target);
		lines.push(line(2, brace(2, ']')));
	}

	lines.push(line(1, brace(1, '}'), ','));

	if (props.boxes.length === 0) {
		lines.push(line(1, property('boxes'), ': ', brace(1, '[]')));
	} else {
		lines.push(line(1, property('boxes'), ': ', brace(1, '[')));
		addBoxes(lines, props.boxes);
		lines.push(line(1, brace(1, ']')));
	}

	lines.push(line(0, brace(0, '}')));
	return <code>{lines}</code>;
}
</script>
