<template>
	<header class="bg-rose-500 dark:bg-stone-900">
		<div class="container mx-auto flex flex-row items-center px-5 py-4">
			<NuxtLink href="/" class="p-2 text-2xl font-extrabold text-stone-100 hover:text-stone-200">Meme Generator</NuxtLink>
			<nav class="ml-auto flex gap-2">
				<nuxt-link v-if="!$auth.loggedIn.value" class="button neutral" :to="getLoginURL()">Login</nuxt-link>
				<button
					v-else
					title="Logout"
					aria-label="Logout"
					@click="authLogout()"
					class="button flex items-center gap-2 bg-rose-400 py-2 hover:bg-rose-300 dark:bg-stone-800 hover:dark:bg-stone-700"
					:class="{ 'outline outline-2 outline-yellow-300 focus-visible:outline-current dark:outline-yellow-600': administrator }"
				>
					{{ $auth.session.value?.name }}
					<img
						v-if="isDefault"
						:src="defaultAvatar"
						alt="Default Avatar"
						class="h-8 w-8 rounded-full"
						decoding="async"
						crossorigin="anonymous"
					/>
					<picture v-else>
						<source
							v-if="isAnimated"
							media="(prefers-reduced-motion: no-preference), (prefers-reduced-data: no-preference)"
							type="image/gif"
							:srcset="makeSrcset('gif')"
						/>
						<source type="image/webp" :srcset="makeSrcset('webp')" />
						<source type="image/png" :srcset="makeSrcset('png')" />
						<img :src="createUrl('png', 128)" alt="Avatar" class="h-8 w-8 rounded-full" decoding="async" crossorigin="anonymous" />
					</picture>
				</button>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
const { session } = useAuth();
const administrator = useAdministrator();

const isDefault = ref(false);
const isAnimated = ref(false);

const defaultAvatar = computed(() =>
	session.value?.id
		? `https://cdn.discordapp.com/embed/avatars/${BigInt(session.value.id) % BigInt(5)}.png`
		: 'https://cdn.discordapp.com/embed/avatars/0.png'
);

watch(
	session,
	(user) => {
		if (user?.avatar) {
			isDefault.value = false;
			isAnimated.value = user.avatar.startsWith('a_');
		} else {
			isDefault.value = true;
			isAnimated.value = false;
		}
	},
	{ immediate: true }
);

function createUrl(format: 'webp' | 'png' | 'gif', size: number) {
	return `https://cdn.discordapp.com/avatars/${session.value!.id}/${session.value!.avatar}.${format}?size=${size}`;
}

function makeSrcset(format: 'webp' | 'png' | 'gif') {
	return `${createUrl(format, 64)} 1x, ${createUrl(format, 128)} 2x, ${createUrl(format, 256)} 3x, ${createUrl(format, 512)} 4x`;
}
</script>
