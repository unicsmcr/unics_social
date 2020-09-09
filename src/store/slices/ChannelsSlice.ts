import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIChannel, APIDMChannel, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

export interface ChannelsSliceState {
	values: {
		[id: string]: APIDMChannel|APIEventChannel|undefined;
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
	}
});

export const { addChannel, removeChannel } = ChannelsSlice.actions;
export const selectChannels = state => state.channels;
export const selectChannel = id => state => state.channels[id];
export default ChannelsSlice.reducer;
