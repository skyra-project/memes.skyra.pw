import { filter, type Canvas } from 'canvas-constructor/browser';
import type { Entry, EntryAvatarPosition, EntryBox, EntryBoxModifiers, EntryBoxModifiersOutlineType, HexadecimalColor } from './transform/entry';

const colors = ['#dc2626', '#65a30d', '#059669', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#e11d48'];
export const AvatarKeys = ['author', 'target'] as const;
export function renderCanvas(canvas: Canvas, image: HTMLImageElement, boxes: Entry['boxes'], avatars: Entry['avatars']) {
	canvas.clearRectangle().setTextBaseline('middle').printImage(image!, 0, 0, canvas.width, canvas.height);

	let index = 0;
	for (const box of boxes) {
		canvas
			.setStroke(colors[index])
			.setColor(`${colors[index]}20`)
			.process(() => renderBox(canvas, box));

		if (++index > colors.length) index = 0;
	}

	index = 0;
	for (const key of AvatarKeys) {
		for (const position of avatars[key]) {
			canvas
				.setStroke(colors[index])
				.setColor(`${colors[index]}20`)
				.process(() => renderAvatar(canvas, position));

			if (++index > colors.length) index = 0;
		}
	}
}

function renderBox(canvas: Canvas, box: EntryBox) {
	const halfWidth = box.width / 2;
	const halfHeight = box.height / 2;

	canvas
		.save()
		.translate(box.x, box.y)
		.rotate(box.rotation * (Math.PI / 180))

		// Draw rectangle
		.printRectangle(-halfWidth, -halfHeight, box.width, box.height)
		.printStrokeRectangle(-halfWidth, -halfHeight, box.width, box.height)

		// Draw guides
		.beginPath()
		.moveTo(-halfWidth, halfHeight)
		.lineTo(0, -halfHeight)
		.lineTo(halfWidth, halfHeight)
		.closePath()
		.stroke()

		.setTextFont(getFont(box.modifiers))
		.setTextAlign(box.modifiers.textAlign)
		.setGlobalAlpha(box.modifiers.opacity);

	const word = box.modifiers.allCaps ? 'PREVIEW' : 'Preview';
	const size = canvas.measureText(word).width;

	const { outlineType, outlineColor, outlineWidth, fontSize: FontSize } = box.modifiers;
	canvas.setColor(box.textColor).process(() => setOutlineWidth(canvas, outlineType, outlineColor, outlineWidth));

	const x = getBoxX(box);
	let y: number;
	if (size <= box.width) {
		y = getBoxY(box, FontSize * 1.2, 1);
	} else {
		const scale = box.width / size;
		setOutlineWidth(canvas, outlineType, outlineColor, Math.max(2, outlineWidth * scale));
		canvas.setTextSize(box.modifiers.fontSize * scale);
		y = getBoxY(box, box.modifiers.fontSize * scale * 1.2, 1);
	}

	if (outlineType === 'outline') canvas.printStrokeText(word, x, y);
	canvas.printText(word, x, y);
	canvas.restore();
}

function getFont(modifiers: EntryBoxModifiers) {
	return `${getFontStyle(modifiers)}${modifiers.fontSize}px ${getFontFamily(modifiers)}`;
}

function getFontStyle(modifiers: EntryBoxModifiers) {
	return modifiers.bold //
		? modifiers.italic
			? 'italic bold '
			: 'bold '
		: modifiers.italic
			? 'italic '
			: '';
}

function getFontFamily(modifiers: EntryBoxModifiers) {
	return modifiers.font === 'impact' ? 'Impact' : 'Arial';
}

function getBoxX(box: EntryBox) {
	// `x = 0` is the center of the box:
	switch (box.modifiers.textAlign) {
		case 'left':
			return -box.width / 2;
		case 'center':
			return 0;
		case 'right':
			return box.width / 2;
	}
}

function getBoxY(box: EntryBox, fontHeight: number, lines: number) {
	// `y = 0` is the middle of the box:
	switch (box.modifiers.verticalAlign) {
		case 'top':
			return fontHeight / 2 - box.height / 2;
		case 'middle':
			return 0 - fontHeight * ((lines - 1) / 2);
		case 'bottom':
			return box.height / 2 - fontHeight * lines + fontHeight / 2;
	}
}

function setOutlineWidth(canvas: Canvas, type: EntryBoxModifiersOutlineType, color: HexadecimalColor, width: number) {
	switch (type) {
		case 'outline':
			canvas.setStrokeWidth(width).setStroke(color);
			break;
		case 'shadow':
			canvas.setFilter(filter('drop-shadow', '0px', '0px', `${width}px`, color));
			break;
		case 'none':
			break;
	}
}

function renderAvatar(canvas: Canvas, avatar: EntryAvatarPosition) {
	const halfSize = avatar.size / 2;

	canvas
		.save()
		.translate(avatar.x, avatar.y)
		.rotate(avatar.rotation * (Math.PI / 180))

		// Draw avatar
		.process(() =>
			avatar.style === 'circle'
				? canvas
						.createCircularPath(0, 0, avatar.size / 2)
						.stroke()
						.fill()
				: canvas
						.printRectangle(-halfSize, -halfSize, avatar.size, avatar.size)
						.printStrokeRectangle(-halfSize, -halfSize, avatar.size, avatar.size)
		)

		// Draw guides
		.beginPath()
		.moveTo(-halfSize, 0)
		.lineTo(halfSize, 0)
		.lineTo(0, -halfSize)
		.closePath()
		.stroke()
		.restore();
}
