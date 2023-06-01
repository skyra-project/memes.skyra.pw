export default eventHandler(async (event) => {
	const session = await getAuthSession(event);
	return session.data;
});
