// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
	typescript: {
		shim: false
	},
	nitro: {
		preset: 'cloudflare-pages',
		prerender: {
			routes: ['/', '/about']
		},
		serveStatic: true
	},
	pwa: {
		manifest: {
			background_color: '#292524',
			categories: ['tools'],
			name: 'Meme Generator',
			description: 'Meme Generator — Generate your memes',
			start_url: 'https://memes.skyra.pw',
			theme_color: '#f43f5e'
		},
		registerType: 'autoUpdate'
	},
	app: {
		head: {
			title: 'Meme Generator',
			htmlAttrs: { lang: 'en' },
			link: [
				// <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
				// <link rel='apple-touch-startup-image' href='/icons/apple-startup.png' />
				{ rel: 'canonical', href: 'https://memes.skyra.pw' }
				// <link rel='icon' href='/icons/android-chrome-192x192.png' />
				// <link rel='icon' href='/favicon.ico' />
				// <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
				// <link rel='icon' type='image/png' sizes='192x192' href='/icons/android-chrome-192x192.png' />
				// <link rel='icon' type='image/png' sizes='194x194' href='/icons/android-chrome-194x194.png' />
				// <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
				// <link rel='manifest' href='/manifest.webmanifest' />
				// <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#f43f5e' />
				// <link rel='shortcut icon' href='/favicon.ico' />
			],
			meta: [
				{ 'http-equiv': 'Cache-Control', content: '1y' },
				{ 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
				{ 'http-equiv': 'Expires', content: '1y' },
				{
					'http-equiv': 'Page-Enter',
					content: 'RevealTrans(Duration=2.0,Transition=2)'
				},
				{
					'http-equiv': 'Page-Exit',
					content: 'RevealTrans(Duration=3.0,Transition=12)'
				},
				{ 'http-equiv': 'Pragma', content: '1y' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
				{ name: 'apple-mobile-web-app-title', content: 'Meme Generator' },
				{ name: 'application-name', content: 'Meme Generator' },
				{ name: 'audience', content: 'all' },
				{ name: 'author', content: 'Aura Román, kyradiscord@gmail.com' },
				{ name: 'coverage', content: 'Worldwide' },
				{ name: 'description', content: 'Meme Generator — Generate your memes' },
				{ name: 'designer', content: 'Aura Román, kyradiscord@gmail.com' },
				{ name: 'distribution', content: 'Global' },
				{ name: 'googlebot', content: 'index,follow' },
				{ name: 'HandheldFriendly', content: 'True' },
				{ name: 'identifier-URL', content: 'https://memes.skyra.pw' },
				{ name: 'keywords', content: 'meme, generator, artiel' },
				{ name: 'msapplication-config', content: '/browserconfig.xml' },
				{ name: 'msapplication-TileColor', content: '#f43f5e' },
				// { name: 'msapplication-TileImage', content: '/icons/mstile-144x144.png' },
				{ name: 'owner', content: 'Aura Román, kyradiscord@gmail.com' },
				{ name: 'rating', content: 'safe for kids' },
				{ name: 'reply-to', content: 'kyradiscord@gmail.com' },
				{ name: 'revisit-after', content: '7 days' },
				{
					name: 'robots',
					content: 'archive,follow,imageindex,index,odp,snippet,translate'
				},
				{ name: 'shortlink', content: 'https://memes.skyra.pw' },
				{ name: 'subject', content: 'Meme Generator — Generate your memes' },
				{ name: 'summary', content: 'Meme Generator — Generate your memes.' },
				{ name: 'target', content: 'all' },
				{ name: 'theme-color', content: '#f43f5e' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:creator', content: '@kyranet_' },
				// { name: 'twitter:image', content: 'https://memes.skyra.pw/icons/opengraph.png' },
				{ name: 'twitter:site', content: '@kyranet_' },
				{ name: 'url', content: 'https://memes.skyra.pw' },
				{
					property: 'og:description',
					content: 'Meme Generator — Generate your memes'
				},
				{ property: 'og:email', content: 'kyradiscord@gmail.com' },
				// { property: 'og:image:alt', content: 'OpenGraphImage' },
				// { property: 'og:image:height', content: '512' },
				// { property: 'og:image:width', content: '1024' },
				// { property: 'og:image', content: 'https://memes.skyra.pw/icons/opengraph.png' },
				{ property: 'og:locale', content: 'en_US' },
				{ property: 'og:site_name', content: 'Meme Generator' },
				{ property: 'og:title', content: 'Meme Generator' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://memes.skyra.pw' }
			]
		}
	}
});
