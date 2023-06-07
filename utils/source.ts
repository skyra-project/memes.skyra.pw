const ImgflipReplacerRegExp = /https?:\/\/imgflip.com\/s\/meme\/([\w\-\.]+)/;
const ImgurReplacerRegExp = /https?\:\/\/imgur.com\/gallery\/([a-zA-Z]+)/;

export function replaceUrl(url: string) {
	let result: RegExpExecArray | null;

	// https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg -> {{base}}/api/i/imgflip/Drake-Hotline-Bling.jpg
	if ((result = ImgflipReplacerRegExp.exec(url))) {
		const base = useRequestURL().origin;
		return { src: `${base}/api/i/imgflip/${result[1]}`, replace: false };
	}

	// https://imgur.com/gallery/QaVWocN -> https://i.imgur.com/QaVWocN.png
	if ((result = ImgurReplacerRegExp.exec(url))) {
		return { src: `https://i.imgur.com/${result[1]}.png`, replace: true };
	}

	return { src: url, replace: false };
}
