import { APIClient, APIDMChannel, APIMessage, GatewayPacketType } from '@unicsmcr/unics_social_api_client';
import API_HOST from './APIHost';
import { setQueueState, QueueStatus, setConnected, setQueueStatus } from '../../store/slices/AuthSlice';
import store from '../../store';
import { addMessage, removeMessage } from '../../store/slices/MessagesSlice';
import { addChannel, fetchChannels } from '../../store/slices/ChannelsSlice';

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
		const channels = store.getState().channels;
		if (!channels.values[message.channelID]) store.dispatch(fetchChannels());
		store.dispatch(addMessage(message));
	});
	gateway.on(GatewayPacketType.MessageDelete, data => {
		const { messageID, channelID }: { messageID: string; channelID: string } = data;
		store.dispatch(removeMessage({ messageID, channelID }));
	});
	gateway.on(GatewayPacketType.JoinDiscoveryQueue, () => {
		console.log('Joined');
		store.dispatch(setQueueStatus(QueueStatus.InQueue));
	});
	gateway.on(GatewayPacketType.LeaveDiscoveryQueue, () => {
		store.dispatch(setQueueStatus(QueueStatus.Idle));
	});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	gateway.on(GatewayPacketType.DiscoveryQueueMatch, data => {
		const channel: APIDMChannel = data.channel;
		store.dispatch(addChannel(channel));
		store.dispatch(setQueueState({
			status: QueueStatus.Idle,
			errorMessage: '',
			match: {
				channelID: channel.id,
				startTime: channel.video?.creationTime ? new Date(channel.video.creationTime).getTime() : Date.now()
			}
		}));
	});
}

const client = makeClient();
export { client };
