import { APIClient, APIMessage, GatewayPacketType } from '@unicsmcr/unics_social_api_client';
import API_HOST from './APIHost';
import { setQueueStatus, QueueStatus, setConnected } from '../../store/slices/AuthSlice';
import store from '../../store';
import { addMessage } from '../../store/slices/MessagesSlice';

export default function makeClient() {
	const token = localStorage.getItem('jwt');
	const apiBase = `${API_HOST}/api/v1`;
	const useWss = process.env.NODE_ENV === 'production';
	const apiClient = new APIClient({
		token: token ?? undefined,
		apiBase,
		useWss
	});
	return apiClient;
}

export function initClientGateway(apiClient: APIClient) {
	if (apiClient.gateway || !apiClient.token) return;
	apiClient.initGateway();

	const gateway = apiClient.gateway!;
	gateway.on(GatewayPacketType.Hello, () => {
		store.dispatch(setConnected(true));
	});
	gateway.on('reconnecting', () => {
		store.dispatch(setConnected(false));
	});
	gateway.on(GatewayPacketType.MessageCreate, data => {
		const message: APIMessage = data.message;
		store.dispatch(addMessage(message));
	});
	gateway.on(GatewayPacketType.JoinDiscoveryQueue, () => {
		console.log('Joined');
		store.dispatch(setQueueStatus(QueueStatus.InQueue));
	});
	gateway.on(GatewayPacketType.LeaveDiscoveryQueue, () => {
		store.dispatch(setQueueStatus(QueueStatus.Idle));
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	gateway.on(GatewayPacketType.DiscoveryQueueMatch, channel => {
		// TODO: navigate user to channel
		store.dispatch(setQueueStatus(QueueStatus.Idle));
	});
}

const client = makeClient();
export { client };
