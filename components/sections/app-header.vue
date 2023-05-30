<template>
	<header class="bg-rose-500 dark:bg-stone-900">
		<div class="container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
			<p class="text-lg sm:py-2 grow">
				<NuxtLink href="/" class="font-extrabold text-2xl text-stone-100 hover:text-stone-200">Meme Generator</NuxtLink>
			</p>
			<nav>
				<nuxt-link :to="getLoginURL()" v-if="!$auth.loggedIn.value">Login</nuxt-link>
				<button v-else @click="authLogout()">{{ $auth.session.value?.name }}</button>
			</nav>
		</div>
	</header>
</template>
