<template>
	<section class="prose prose-stone dark:prose-invert max-w-none">
		<template v-if="!code">
			<h1>Missing code</h1>
			<p>Please use the <code>Login</code> button instead or click <NuxtLink to="/login" class="underline">here</NuxtLink>.</p>
		</template>
		<template v-else-if="error">
			<h1>Failed to complete authentication flow:</h1>
			<pre><code>{{ error }}</code></pre>
		</template>
	</section>
</template>

<script setup lang="ts">
import { updateSession } from 'h3';

const { code } = useRoute().query;

const redirectUri = `${getOrigin()}/auth/callback`;
const { data, error, execute } = await useFetch('/api/auth/callback', {
	body: JSON.stringify({ code, redirectUri }),
	method: 'POST',
	key: 'callback',
	immediate: false
});

if (code) {
	await execute();
	if (data.value) {
		if (process.server) await updateSession(useRequestEvent(), getServerSessionConfig(), data.value);
		await navigateTo(useAuth().redirectTo.value, { replace: true });
	}
}

useSeoMeta({
	title: 'Auth Callback',
	robots: { none: true },
	ogTitle: 'Auth Callback',
	ogDescription: 'A landing page for the OAuth2.0 callback flow, use the Login button instead.'
});
</script>
