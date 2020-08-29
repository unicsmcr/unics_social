import { createSlice } from '@reduxjs/toolkit';

export const ChannelsSlice = createSlice({
	name: 'channels',
	initialState: [],
	reducers: {
		setChannels: (state, action) => {
			state = action.payload;
		},
		appendChannel: (state, action) => {
			state.push(action.payload);
		},
		removeChannel: (state, action) => {
			state = state.filter(channel => channel !== action.payload);
		}
	}
});
export const { setChannels, appendChannel, removeChannel } = ChannelsSlice.actions;
export const selectChannels = state => state.channels;
export default ChannelsSlice.reducer;
