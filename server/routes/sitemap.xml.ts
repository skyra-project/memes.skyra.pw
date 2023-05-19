import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
	// Fetch all documents
	const sitemap = new SitemapStream({
		hostname: 'https://memes.skyra.pw'
	});
	sitemap.write({ url: '/', changefreq: 'monthly' });
	sitemap.write({ url: '/about', changefreq: 'monthly' });

	sitemap.end();
	return streamToPromise(sitemap);
});
