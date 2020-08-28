import { APIClient } from '@unicsmcr/unics_social_api_client';

export default function makeClient() {
	const token = localStorage.getItem('jwt');
	const apiBase = process.env.NODE_ENV === 'production' ? 'https://kb-api.unicsmcr.com/api/v1' : 'http://localhost:8060/api/v1';
	const useWss = process.env.NODE_ENV === 'production';
	return new APIClient({
		token: token ?? undefined,
		apiBase,
		useWss
	});
}
