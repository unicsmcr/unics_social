import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIChannel, APIDMChannel, APIEventChannel, APIMessage } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { addMessage, fetchMessages } from './MessagesSlice';
import { wrapAPIError } from './util';

export interface ChannelsSliceState {
	values: {
		[id: string]: (APIDMChannel|APIEventChannel) & {
			firstMessage?: string;
		};
	};
}

const initialState: ChannelsSliceState = {
	values: {}
};

export const fetchChannels = createAsyncThunk('channels/fetchChannels', (_, { dispatch }) => client.getChannels().catch(err => wrapAPIError(err, dispatch)));

export const ChannelsSlice = createSlice({
	name: 'channels',
	initialState,
	reducers: {
		addChannel: (state, action) => {
			const channel: APIChannel = action.payload;
			state[channel.id] = channel;
		},
		removeChannel: (state, action) => {
			const channelID: string = action.payload;
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.values[channelID];
		}
	},
	extraReducers(builder) {
		builder.addCase(fetchChannels.fulfilled, (state, action) => {
			state.values = Object.fromEntries(action.payload.map(channel => ([channel.id, channel])));
		});
		builder.addCase(fetchMessages.fulfilled, (state, action) => {
			const length = action.payload.length;
			if (length > 0 && length < 50) {
				const channel = state.values[action.meta.arg.channelID];
				if (channel) {
					channel.firstMessage = action.payload[length - 1].time;
				}
			}
		});
		builder.addCase(addMessage, (state, action) => {
			const message: APIMessage = action.payload;
			const channel = state.values[message.channelID];
			if (channel && message.time > channel.lastUpdated) {
				channel.lastUpdated = message.time;
			}
		});
	}
});

export const { addChannel, removeChannel } = ChannelsSlice.actions;

export const selectChannels = (state: { channels: ChannelsSliceState }) => state.channels.values;
export const selectChannelsSorted = (state: { channels: ChannelsSliceState }) => Object.values(state.channels.values).sort((b, a) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
export const selectChannel = (id: string) => (state: { channels: ChannelsSliceState }) => state.channels.values[id];

export const selectDMChannels = (state: { channels: ChannelsSliceState }) => Object.values(state.channels.values).filter(channel => channel.type === 'dm');
export const selectEventChannels = (state: { channels: ChannelsSliceState }) => Object.values(state.channels.values).filter(channel => channel.type === 'event');

export default ChannelsSlice.reducer;
