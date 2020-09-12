import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIMessage } from '@unicsmcr/unics_social_api_client';
import { client } from '../../components/util/makeClient';
import { wrapAPIError } from './util';

export type OptimisedAPIMessage = Omit<APIMessage, 'time'> & { time: number };

function optimiseAPIMessage(message: APIMessage) {
	return {
		...message,
		time: new Date(message.time).getTime()
	};
}

export interface MessagesSliceState {
	values: {
		[id: string]: OptimisedAPIMessage[];
	};
}

const initialState: MessagesSliceState = {
	values: {}
};

export const fetchMessages = createAsyncThunk('messages/fetchMessages', (channelID: string) => client.getMessages(channelID).catch(wrapAPIError));
export const createMessage = createAsyncThunk('messages/createMessage', (data: { content: string; channelID: string }) => client.createMessage(data).catch(wrapAPIError));

/**
 * Inserts messages into a list of existing messages
 * @param messages Newest messages should be first in list
 * @param state Existing state
 */
function insertMessagesToList(_messages: OptimisedAPIMessage[], state: OptimisedAPIMessage[]): OptimisedAPIMessage[] {
	const existing = new Set(state.map(msg => msg.id));
	const messages = _messages.filter(msg => !existing.has(msg.id));
	let index = state.length - 1;
	messages.reverse();
	while (index >= 0 && messages.length > 0) {
		const entryCandidate = messages[0];
		const existingCandidate = state[index];
		if (entryCandidate.id === existingCandidate.id) {
			messages.shift();
			continue;
		}
		if (entryCandidate.time > existingCandidate.time) {
			state.splice(index + 1, 0, entryCandidate);
			messages.shift();
			continue;
		}
		index--;
	}
	state.unshift(...messages);
	return state;
}

export const MessagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage: (state, action) => {
			const _message: APIMessage = action.payload;
			const message: OptimisedAPIMessage = optimiseAPIMessage(_message);
			const channelID = message.channelID;
			if (!state.values[channelID]) state.values[channelID] = [];
			const messages = state.values[channelID];
			insertMessagesToList([message], messages);
		},
		deleteMessage: (state, action) => {
			const { channelID, messageID }: { channelID: string; messageID: string } = action.payload;
			if (state.values[channelID]) {
				const index = state.values[channelID].findIndex(msg => msg.id === messageID);
				if (index !== -1) state.values[channelID].splice(index, 1);
			}
		}
	},
	extraReducers(builder) {
		builder.addCase(fetchMessages.fulfilled, (state, action) => {
			const newMessages = action.payload.map(message => optimiseAPIMessage(message));
			if (newMessages.length === 0) return;
			const channelID = action.meta.arg;
			if (!state.values[channelID]) state.values[channelID] = [];
			const messages = state.values[channelID];
			insertMessagesToList(newMessages, messages);
		});
		builder.addCase(createMessage.fulfilled, (state, action) => {
			const message = optimiseAPIMessage(action.payload);
			const channelID = message.channelID;
			if (!state.values[channelID]) state.values[channelID] = [];
			const messages = state.values[channelID];
			insertMessagesToList([message], messages);
		});
	}
});

export const { addMessage, deleteMessage } = MessagesSlice.actions;

export const selectMessages = (channelID: string) => (state: { messages: MessagesSliceState }) => state.messages.values[channelID] ?? [];

export default MessagesSlice.reducer;
