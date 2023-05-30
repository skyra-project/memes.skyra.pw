<template>
	<div v-if="!code">Missing code</div>
	<div>
		<h1 v-if="pending" class="animate-pulse font-extrabold text-4xl">Loading...</h1>
		<div v-else-if="error" class="">
			<h1 class="font-extrabold text-4xl pb-4">Failed to complete authentication flow:</h1>
			<pre><code>{{ error }}</code></pre>
		</div>
		<div v-else-if="data">
			<h1 class="font-extrabold text-4xl pb-4">Welcome {{ data.name }}</h1>
			<p>You will be redirected to the main page in a second.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
const { code } = useRoute().query;

const { data, error, pending, execute } = useFetch('/api/auth/callback', { body: JSON.stringify({ code }), method: 'POST', immediate: false });

if (process.client && code) {
	await execute();
	await useAuth().updateSession();
}

useHead({ title: 'Auth Callback' });
useSeoMeta({
	robots: { none: true },
	ogTitle: 'Auth Callback',
	ogDescription: 'A landing page for the OAuth2.0 callback flow, use the Login button instead.'
});
</script>
