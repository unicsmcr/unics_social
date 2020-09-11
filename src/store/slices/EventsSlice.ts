import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIEvent } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

export interface EventsSliceState {
	values: {
		[id: string]: APIEvent;
	};
}

const initialState: EventsSliceState = {
	values: {}
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', () => client.getEvents().catch(wrapAPIError));

export const EventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {
		addEvent: (state, action) => {
			const event: APIEvent = action.payload;
			state[event.id] = event;
		},
		removeEvent: (state, action) => {
			const eventID: string = action.payload;
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete state.values[eventID];
		}
	},
	extraReducers(builder) {
		builder.addCase(fetchEvents.fulfilled, (state, action) => {
			state.values = Object.fromEntries(action.payload.map(event => ([event.id, event])));
			console.log(state.values);
		});
	}
});

export const { addEvent, removeEvent } = EventsSlice.actions;

export const selectEvents = (state: { events: EventsSliceState }) => state.events.values;
export const selectEvent = (id: string) => (state: { events: EventsSliceState }) => state.events.values[id];

export default EventsSlice.reducer;
