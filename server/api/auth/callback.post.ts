export default eventHandler(async (event) => {
	const session = await useAuthSession(event);
	const { code } = (await readBody(event)) as OAuth2BodyData;
	if (typeof code !== 'string') {
		throw createError({ message: 'Missing parameters in body', statusCode: 400 });
	}

	const data = await fetchAccessToken(code);
	if (!data) {
		throw createError({ message: 'Failed to fetch the token', statusCode: 500 });
	}

	const user = await fetchUser(data.access_token);
	if (!user) {
		throw createError({ message: 'Failed to fetch the user', statusCode: 500 });
	}

	await session.update({ id: user.id, name: user.username, avatar: user.avatar });
	return session.data;
});

interface OAuth2BodyData {
	code: string;
}
