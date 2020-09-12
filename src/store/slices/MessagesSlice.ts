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
			let index = messages.length - 1;
			while (index >= 0) {
				const candidate = messages[index];
				if (candidate.time <= message.time) {
					messages.splice(index + 1, 0, message);
					index--;
					break;
				}
				index--;
			}

			// Message never inserted
			if (index === -1) {
				messages.unshift(message);
			}
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
			let index = messages.length - 1;
			// todo: This implementation is flawed, redo it at some point!!
			while (index >= 0) {
				const candidate = messages[index];
				if (candidate.time <= newMessages[0].time) {
					messages.splice(index + 1, 0, ...newMessages);
					index--;
					break;
				}
				index--;
			}
			if (index === -1) {
				messages.unshift(...newMessages);
			}
		});
	}
});

export const { addMessage, deleteMessage } = MessagesSlice.actions;

export const selectMessages = (channelID: string) => (state: { messages: MessagesSliceState }) => state.messages.values[channelID] ?? [];

export default MessagesSlice.reducer;
