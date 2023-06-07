const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('uid', {
		created(element: HTMLElement) {
			element.setAttribute('id', element.id || uid());
		},
		getSSRProps() {
			return { id: uid() };
		}
	});
});
