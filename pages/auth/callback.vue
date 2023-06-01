<template>
	<section class="prose prose-stone dark:prose-invert max-w-none">
		<client-only>
			<template v-if="!code">
				<h1>Missing code</h1>
				<p>Please use the <code>Login</code> button instead or click <NuxtLink to="/login" class="underline">here</NuxtLink>.</p>
			</template>
			<template v-else>
				<h1 v-if="pending" class="animate-pulse">Loading...</h1>
				<template v-else-if="error">
					<h1>Failed to complete authentication flow:</h1>
					<pre><code>{{ error }}</code></pre>
				</template>
				<template v-else-if="data">
					<h1>Welcome {{ data.name }}</h1>
					<p>You will be redirected to the main page in a second.</p>
					<div class="p-1 mt-2 rounded-lg bg-gray-200 dark:bg-stone-900" aria-label="Progress" role="progressbar">
						<div class="h-4 rounded-md bg-rose-500 progress"></div>
					</div>
				</template>
			</template>
		</client-only>
	</section>
</template>

<script setup lang="ts">
const { code } = useRoute().query;
const router = useRouter();
const auth = useAuth();

const redirectUri = `${getOrigin()}/auth/callback`;
const { data, error, pending, execute } = useFetch('/api/auth/callback', {
	body: JSON.stringify({ code, redirectUri }),
	method: 'POST',
	immediate: false
});

if (process.client && code) {
	execute().then(() => {
		auth.session.value = data.value;
		useTimeoutFn(() => router.push(auth.redirectTo.value), 1000);
	});
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
