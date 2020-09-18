import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIEvent, APIEventChannel } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { fetchChannels } from './ChannelsSlice';
import { wrapAPIError } from './util';

export interface EventsSliceState {
	values: {
		[id: string]: APIEvent;
	};
}

const initialState: EventsSliceState = {
	values: {}
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', (_, { dispatch }) => client.getEvents().catch(err => wrapAPIError(err, dispatch)));

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
		builder.addCase(fetchChannels.fulfilled, (state, action) => {
			for (const channel of action.payload.filter(channel => channel.type === 'event') as APIEventChannel[]) {
				state.values[channel.event.id] = channel.event;
			}
		});
	}
});

export const { addEvent, removeEvent } = EventsSlice.actions;

export const selectEvents = (state: { events: EventsSliceState }) => state.events.values;
export const selectEvent = (id: string) => state => state.events.values[id];

export default EventsSlice.reducer;
