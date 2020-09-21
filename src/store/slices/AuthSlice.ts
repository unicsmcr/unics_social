import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../components/util/makeClient';
import { QueueOptions } from '@unicsmcr/unics_social_api_client';

export enum QueueStatus {
	InQueue,
	Idle,
	Joining,
	Failed,
	Leaving,
}

export interface QueueState {
	status: QueueStatus;
	errorMessage: string;
	match?: {
		channelID: string;
		startTime: number;
	};
}

interface AuthSliceState {
	jwt: string | null;
	queue: QueueState;
	connected: boolean;
}

const initialState: AuthSliceState = {
	jwt: localStorage.getItem('jwt'),
	queue: {
		status: QueueStatus.Idle,
		errorMessage: ''
	},
	connected: false
};

export const joinDiscoveryQueue = createAsyncThunk('auth/joinQueue', (options: QueueOptions) => client.gateway?.joinDiscoveryQueue(options));
export const leaveDiscoveryQueue = createAsyncThunk('auth/leaveQueue', () => client.gateway?.leaveDiscoveryQueue());

export const AuthSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setJWT: (state, action) => {
			if (action.payload !== state.jwt) {
				state.jwt = action.payload;

				if (action.payload) {
					localStorage.setItem('jwt', action.payload);
				} else {
					client.destroy();
					state.connected = false;
					state.queue = {
						status: QueueStatus.Idle,
						errorMessage: ''
					};
					localStorage.removeItem('jwt');
				}
			}
		},
		setQueueState: (state, action: { payload: QueueState }) => {
			state.queue = action.payload;
		},
		setQueueStatus: (state, action) => {
			state.queue.status = action.payload;
		},
		setConnected: (state, action) => {
			state.connected = action.payload;
			if (!state.connected) {
				state.queue = {
					status: QueueStatus.Idle,
					errorMessage: ''
				};
			}
		}
	},
	extraReducers(builder) {
		builder.addCase(joinDiscoveryQueue.pending, state => {
			state.queue.status = QueueStatus.Joining;
		});

		builder.addCase(joinDiscoveryQueue.fulfilled, state => {
			state.queue.status = QueueStatus.InQueue;
		});

		builder.addCase(joinDiscoveryQueue.rejected, (state, action) => {
			state.queue.status = QueueStatus.Failed;
			state.queue.errorMessage = action.error.message as string;
		});

		builder.addCase(leaveDiscoveryQueue.pending, state => {
			state.queue.status = QueueStatus.Leaving;
		});

		builder.addCase(leaveDiscoveryQueue.rejected, (state, action) => {
			state.queue.status = QueueStatus.Failed;
			state.queue.errorMessage = action.error.message as string;
		});

		builder.addCase(leaveDiscoveryQueue.fulfilled, state => {
			state.queue.status = QueueStatus.Idle;
		});
	}
});

export const { setJWT, setQueueState, setQueueStatus, setConnected } = AuthSlice.actions;

export const selectJWT = state => state.auth.jwt;

export const selectConnected = state => state.auth.connected;

export const selectQueueState = (state: { auth: AuthSliceState }) => state.auth.queue;

export const selectQueueMatch = (state: { auth: AuthSliceState }) => selectQueueState(state).match;

export default AuthSlice.reducer;
