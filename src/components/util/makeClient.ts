import { APIClient, GatewayPacketType } from '@unicsmcr/unics_social_api_client';
import API_HOST from './APIHost';
import { setQueueStatus, QueueStatus } from '../../store/slices/AuthSlice';
import store from '../../store';

export default function makeClient() {
	const token = localStorage.getItem('jwt');
	const apiBase = `${API_HOST}/api/v1`;
	const useWss = process.env.NODE_ENV === 'production';
	const apiClient = new APIClient({
		token: token ?? undefined,
		apiBase,
		useWss
	});
	apiClient.initGateway();
	addQueueListeners(apiClient);
	return apiClient;
}

function addQueueListeners(apiClient: APIClient) {
	if (!apiClient.gateway) return;
	apiClient.gateway.on(GatewayPacketType.JoinDiscoveryQueue, () => {
		console.log('Joined');
		store.dispatch(setQueueStatus(QueueStatus.InQueue));
	});
	apiClient.gateway.on(GatewayPacketType.LeaveDiscoveryQueue, () => {
		store.dispatch(setQueueStatus(QueueStatus.Idle));
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	apiClient.gateway.on(GatewayPacketType.DiscoveryQueueMatch, channel => {
		// TODO: navigate user to channel
		store.dispatch(setQueueStatus(QueueStatus.Idle));
	});
}

const client = makeClient();
export { client };
