export const useAdministrators = () => useRuntimeConfig().public.administrators as string[];
export const useAdministrator = () => {
	const auth = useAuth();
	const administrators = useAdministrators();
	return computed(() => (auth.session.value?.id ? administrators.includes(auth.session.value.id) : false));
};
