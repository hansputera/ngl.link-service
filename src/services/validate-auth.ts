import type {AxiosResponse} from 'axios';
import {fetchApi} from '../fetchApi';

export const validateAuth = async (
	token: string,
	id: string,
) => {
	const response = await fetchApi.post('/api/validation/token', {
		token,
		id,
	}).catch(e => e.response as AxiosResponse);

	return response.status === 200;
};
