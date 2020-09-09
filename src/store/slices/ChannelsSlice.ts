import { createSlice } from '@reduxjs/toolkit';
import { APIChannel } from '@unicsmcr/unics_social_api_client';

export interface ChannelsSliceState {
	values: {
		[id: string]: APIChannel|undefined;
	};
}

const initialState: ChannelsSliceState = {
	values: {}
};

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
export default ChannelsSlice.reducer;
