import { createSlice } from '@reduxjs/toolkit';

interface ReadSliceState {
	values: {
		[id: string]: number;
	};
}

const initialState: ReadSliceState = {
	values: {}
};

export const ReadSlice = createSlice({
	name: 'read',
	initialState,
	reducers: {
		readChannel(state, action) {
			if (!state.values[action.payload.channelID] || state.values[action.payload.channelID] < action.payload.time) {
				state.values[action.payload.channelID] = action.payload.time || Date.now();
			}
		}
	}
});

export const { readChannel } = ReadSlice.actions;

export const selectReadTime = (channelID: string) => (state: { read: ReadSliceState }) => state.read.values[channelID];

export default ReadSlice.reducer;
