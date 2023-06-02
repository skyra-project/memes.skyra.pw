import type { SessionConfig } from 'h3';

const manifestIcons = [
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-36x36.png',
		sizes: '36x36',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-48x48.png',
		sizes: '48x48',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-72x72.png',
		sizes: '72x72',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-96x96.png',
		sizes: '96x96',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-144x144.png',
		sizes: '144x144',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-192x192.png',
		sizes: '192x192',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-256x256.png',
		sizes: '256x256',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-384x384.png',
		sizes: '384x384',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/android-chrome-512x512.png',
		sizes: '512x512',
		type: 'image/png'
	},
	{
		src: 'https://memes.skyra.pw/icons/maskable_icon.png',
		sizes: '640x640',
		type: 'image/png',
		purpose: 'maskable'
	}
];

const name = 'Meme Template Generator';
const description = "A small but complete interactive browser utility to create new meme templates for Artiel's meme generator.";

export default defineNuxtConfig({
	modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@vite-pwa/nuxt', 'nuxt-security'],
	runtimeConfig: {
		auth: {
			name: 'artiel-auth',
			maxAge: 604800,
			password: process.env.AUTH_SECRET ?? '',
			cookie: { sameSite: 'lax' },
			sessionHeader: false
		} satisfies SessionConfig,
		origin: process.env.ORIGIN,
		clientId: process.env.DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET,
		public: {
			origin: process.env.ORIGIN,
			clientId: process.env.DISCORD_CLIENT_ID
		}
	},
	security: {
		allowedMethodsRestricter: ['GET', 'POST'],
		headers: {
			contentSecurityPolicy: {
				'img-src': ["'self'", 'data:', 'cdn.skyra.pw', 'memes.skyra.pw', 'cdn.discordapp.com', 'imgflip.com']
			},
			permissionsPolicy: {
				accelerometer: ['()'],
				'ambient-light-sensor': ['()'],
				autoplay: ['()'],
				battery: ['()'],
				camera: ['()'],
				'display-capture': ['()'],
				'document-domain': ['()'],
				'encrypted-media': ['()'],
				fullscreen: ['()'],
				gamepad: ['()'],
				geolocation: ['()'],
				gyroscope: ['()'],
				hid: ['()'],
				'idle-detection': ['()'],
				'local-fonts': ['()'],
				magnetometer: ['()'],
				microphone: ['()'],
				midi: ['()'],
				payment: ['()'],
				'picture-in-picture': ['()'],
				'publickey-credentials-get': ['()'],
				'screen-wake-lock': ['()'],
				serial: ['()'],
				'speaker-selection': ['()'],
				usb: ['()'],
				'web-share': ['()'],
				'xr-spatial-tracking': ['()']
			}
		},
		corsHandler: {
			origin: process.env.ORIGIN || '*',
			methods: ['GET', 'POST']
		},
		rateLimiter: false
	},
	nitro: {
		preset: 'cloudflare-pages',
		prerender: {
			routes: ['/', '/about', '/sitemap.xml']
		}
	},
	typescript: {
		shim: false,
		tsConfig: {
			compilerOptions: {
				moduleResolution: 'bundler'
			}
		}
	},
	pwa: {
		registerType: 'autoUpdate',
		devOptions: {
			enabled: false,
			type: 'module'
		},
		workbox: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,png,svg,ico,xml}']
		},
		manifest: {
			background_color: '#292524',
			categories: ['discord', 'bot', 'skyra', 'moderation', 'automation', 'kyra', 'favna', 'kyranet'],
			description,
			display: 'minimal-ui',
			lang: 'en',
			name,
			orientation: 'portrait-primary',
			scope: '/',
			short_name: 'ArchId',
			start_url: '/',
			theme_color: '#f43f5e',
			icons: manifestIcons,
			shortcuts: [
				{
					name: 'Meme Template Generator Home',
					short_name: name,
					description: 'Go to Meme Template Generator',
					url: '/',
					icons: manifestIcons
				}
			]
		}
	},
	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Meme Template Generator',
			htmlAttrs: { lang: 'en' },
			link: [
				{ rel: 'alternate', href: 'https://memes.skyra.pw' },
				{ rel: 'canonical', href: 'https://memes.skyra.pw' },
				{ rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
				{ rel: 'apple-touch-startup-image', href: '/icons/apple-startup.png' },
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'icon', href: '/icons/favicon-16x16.png' },
				{ rel: 'icon', href: '/icons/android-chrome-192x192.png' },
				{ rel: 'icon', href: '/icons/favicon-32x32.png' },
				{ rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg' },
				{ rel: 'shortcut icon', href: '/favicon.ico' }
			],
			meta: [
				{ 'http-equiv': 'Cache-Control', content: '1y' },
				{ 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
				{ 'http-equiv': 'Expires', content: '1y' },
				{ 'http-equiv': 'Pragma', content: '1y' },
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
				{ name: 'apple-mobile-web-app-title', content: name },
				{ name: 'application-name', content: name },
				{ name: 'audience', content: 'all' },
				{ name: 'author', content: 'Skyra Project, contact@skyra.pw' },
				{ name: 'coverage', content: 'Worldwide' },
				{ name: 'description', content: description },
				{ name: 'designer', content: 'Aura Román, kyradiscord@gmail.com' },
				{ name: 'distribution', content: 'Global' },
				{ name: 'googlebot', content: 'index,follow' },
				{ name: 'HandheldFriendly', content: 'True' },
				{ name: 'identifier-URL', content: 'https://memes.skyra.pw' },
				{ name: 'keywords', content: 'skyra, discord, bot, meme, template, generator' },
				{ name: 'msapplication-config', content: '/icons/browserconfig.xml' },
				{ name: 'msapplication-TileColor', content: '#55ACEE' },
				{ name: 'msapplication-TileImage', content: '/icons/mstile-144x144.png' },
				{ name: 'owner', content: 'Aura Román, kyradiscord@gmail.com' },
				{ name: 'rating', content: 'safe for kids' },
				{ name: 'reply-to', content: 'contact@skyra.pw' },
				{ name: 'revisit-after', content: '7 days' },
				{ name: 'robots', content: 'archive,follow,imageindex,index,odp,snippet,translate' },
				{ name: 'shortlink', content: 'https://memes.skyra.pw' },
				{ name: 'subject', content: description },
				{ name: 'summary', content: description },
				{ name: 'target', content: 'all' },
				{ name: 'theme-color', content: '#55ACEE' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:creator', content: '@kyranet_' },
				{ name: 'twitter:image', content: 'https://memes.skyra.pw/icons/opengraph.png' },
				{ name: 'twitter:site', content: '@kyranet_' },
				{ name: 'url', content: 'https://memes.skyra.pw' },
				{ property: 'og:description', content: description },
				{ property: 'og:email', content: 'contact@skyra.pw' },
				{ property: 'og:image:alt', content: 'OpenGraphImage' },
				{ property: 'og:image:height', content: '512' },
				{ property: 'og:image:width', content: '1024' },
				{ property: 'og:image', content: 'https://memes.skyra.pw/icons/opengraph.png' },
				{ property: 'og:locale', content: 'en' },
				{ property: 'og:title', content: name },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://memes.skyra.pw' }
			]
		}
	}
});
