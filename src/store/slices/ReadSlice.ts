import { createSlice } from '@reduxjs/toolkit';

interface ReadSliceState {
	values: {
		[id: string]: number;
	};
}

const initialState: ReadSliceState = {
	values: {}
};

// Syncing message read times is actually quite difficult. For now, notifications are only for messages after the app is first opened.
export const startTime = Date.now();

export const ReadSlice = createSlice({
	name: 'read',
	initialState,
	reducers: {
		readChannel(state, action) {
			if (!state.values[action.payload.channelID] || state.values[action.payload.channelID] < action.payload.time) {
				state.values[action.payload.channelID] = action.payload.time || Date.now() || document.hasFocus();	
			}
		}
	}
});

export const { readChannel } = ReadSlice.actions;

export const selectHasUserChanges = (state: any) => Object.values(state.channels.values).filter((channel: any) => new Date(channel.lastUpdated).getTime() > (state.read.values[channel.id] || startTime)).map((channel: any) => channel.id);
export const selectReadTimes = (state: { read: ReadSliceState }) => state.read.values;
export const selectReadTime = (channelID: string) => (state: { read: ReadSliceState }) => state.read.values[channelID] || startTime;

export default ReadSlice.reducer;
