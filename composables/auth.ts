export const useAuth = () => useNuxtApp().$auth;

export function getLoginURL() {
	const DiscordOauthURL = `https://discord.com/oauth2/authorize`;
	const url = new URL(DiscordOauthURL);
	url.search = new URLSearchParams([
		['redirect_uri', `${getOrigin()}/auth/callback`],
		['response_type', 'code'],
		['scope', 'identify'],
		['client_id', getClientId()]
	]).toString();
	return url.toString();
}

export const authLogout = async () => {
	await $fetch('/api/auth/logout', {
		method: 'POST'
	});
	await useAuth().updateSession();
};
