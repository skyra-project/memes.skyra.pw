<template>
	<section class="prose prose-stone dark:prose-invert max-w-none">
		<h1>About</h1>
		<p>
			<span class="font-bold">Meme Generator</span> is a free open-source platform to generate the templates used in
			<NuxtLink href="https://github.com/skyra-project/artiel">Artiel</NuxtLink>, built with
			<NuxtLink href="https://nuxt.com">Nuxt v3</NuxtLink> and <NuxtLink href="https://tailwindcss.com/">TailwindCSS</NuxtLink>, this utility
			aims to provide a privacy-first fast and responsive website to create new templates.
		</p>
		<hr />

		<p>
			All data is stored exclusively in your browser tab's memory, meaning that all the data is not persistent and will not persist across
			refreshes. The only exception to this is the <code>artiel-auth</code> cookie which is used for authorization.
		</p>
		<hr />

		<p>
			If this website lacks of a tool that you wish to use, or you encounter a problem, please open a new issue or Pull Request in the
			<NuxtLink href="https://github.com/skyra-project/memes.skyra.pw">GitHub repository</NuxtLink>.
		</p>
	</section>
</template>

<script setup lang="ts">
useSeoMeta({
	title: 'About',
	ogTitle: 'About',
	ogDescription: 'About the Meme Template Generator'
});
</script>
