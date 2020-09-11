import { APIEvent, APIUser } from '@unicsmcr/unics_social_api_client';
import API_HOST from './APIHost';

const getAsset = id => `${API_HOST}/assets/${id}.png`;

export default function getIcon(res: string|APIUser|APIEvent) {
	if (typeof res === 'string') {
		return getAsset(res);
	} else if (res.hasOwnProperty('forename')) {
		const user = res as APIUser;
		return user.profile?.avatar ? getAsset(user.id) : undefined;
	}
	const event = res as APIEvent;
	return event.image ? getAsset(event.id) : undefined;
}
