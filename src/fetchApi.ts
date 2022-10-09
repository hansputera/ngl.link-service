import axios from 'axios';
import {apiAddress} from './env';

export const fetchApi = axios.create({
	// eslint-disable-next-line @typescript-eslint/naming-convention
	baseURL: apiAddress,
});
