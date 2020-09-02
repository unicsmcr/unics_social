import { APIClient } from '@unicsmcr/unics_social_api_client';
import API_HOST from './APIHost';

export default function makeClient() {
	const token = localStorage.getItem('jwt');
	const apiBase = `${API_HOST}/api/v1`;
	const useWss = process.env.NODE_ENV === 'production';
	return new APIClient({
		token: token ?? undefined,
		apiBase,
		useWss
	});
}

const client = makeClient();
export { client };
