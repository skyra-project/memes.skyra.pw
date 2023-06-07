export default defineEventHandler((event) => {
	return sendProxy(event, `https://imgflip.com/s/meme/${event.context.params!.name}`, {
		cookieDomainRewrite: '',
		cookiePathRewrite: '',
		sendStream: true
	});
});
