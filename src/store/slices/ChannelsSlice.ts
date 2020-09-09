import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIChannel, APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

export interface ChannelsSliceState {
	values: {
		[id: string]: APIDMChannel|APIEventChannel;
	};
}

const initialState: ChannelsSliceState = {
	values: {}
};

export const fetchChannels = createAsyncThunk('channels/fetchChannels', () => client.getChannels().catch(wrapAPIError));

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
			delete state[channelID];
		}
	},
	extraReducers(builder) {
		builder.addCase(fetchChannels.fulfilled, (state, action) => {
			state.values = Object.fromEntries(action.payload.map(channel => ([channel.id, channel])));
			console.log(state.values);
		});
	}
});

export const { addChannel, removeChannel } = ChannelsSlice.actions;

export const selectChannels = (state: ChannelsSliceState) => state.values;
export const selectChannel = (id: string) => (state: ChannelsSliceState) => state.values[id];

export const selectDMChannels = (state: ChannelsSliceState) => Object.values(state.values).filter(channel => channel?.type === 'dm');
export const selectEventChannels = (state: ChannelsSliceState) => Object.values(state.values).filter(channel => channel?.type === 'event');

export default ChannelsSlice.reducer;
