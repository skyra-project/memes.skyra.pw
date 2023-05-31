<template>
	<client-only>
		<div v-if="!code">
			<h1 class="font-extrabold text-4xl pb-4">Missing code</h1>
			<p>Please use the Login button instead or click <nuxt-link to="/login" class="underline">here</nuxt-link>.</p>
		</div>
		<div v-else>
			<h1 v-if="pending" class="animate-pulse font-extrabold text-4xl">Loading...</h1>
			<div v-else-if="error" class="">
				<h1 class="font-extrabold text-4xl pb-4">Failed to complete authentication flow:</h1>
				<pre><code>{{ error }}</code></pre>
			</div>
			<div v-else-if="data">
				<h1 class="font-extrabold text-4xl pb-4">Welcome {{ data.name }}</h1>
				<p>You will be redirected to the main page in a second.</p>
				<div class="p-1 mt-2 rounded-lg bg-gray-200 dark:bg-stone-900" aria-label="Progress" role="progressbar">
					<div class="h-4 rounded-md bg-rose-500 progress"></div>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script setup lang="ts">
const { code } = useRoute().query;
const router = useRouter();
const auth = useAuth();

const redirectUri = `${getDomain()}/auth/callback`;
const { data, error, pending, execute } = useFetch('/api/auth/callback', {
	body: JSON.stringify({ code, redirectUri }),
	method: 'POST',
	immediate: false
});

if (process.client && code) {
	await execute();
	auth.session.value = data.value;
	useTimeoutFn(() => router.push(auth.redirectTo.value), 1000);
}

useSeoMeta({
	title: 'Auth Callback',
	robots: { none: true },
	ogTitle: 'Auth Callback',
	ogDescription: 'A landing page for the OAuth2.0 callback flow, use the Login button instead.'
});
</script>

<style scoped>
.progress {
	animation: progressAnimation 1s;
}

@keyframes progressAnimation {
	from {
		width: 0;
	}
	to {
		width: 100%;
	}
}
</style>
