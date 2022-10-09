import {fetchApi} from '../fetchApi';

export const validateAuth = async (
	token: string,
	id: string,
) => {
	const response = await fetchApi.post('/api/validation/token', {
		token,
		id,
	});

	return response.status === 200;
};
