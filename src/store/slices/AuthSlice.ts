import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../components/util/makeClient';
import { QueueOptions } from '@unicsmcr/unics_social_api_client';
import asAPIError from '../../components/util/asAPIError';

export enum QueueStatus {
	InQueue,
	Idle,
	Joining,
	FailedLeaving,
	FailedJoining,
	Leaving,
}

interface QueueState {
	status: QueueStatus;
	errorMessage: string;
}
interface AuthSliceState {
	jwt: string | null;
	queue: QueueState;
}

const initialState: AuthSliceState = {
	jwt: localStorage.getItem('jwt'),
	queue: {
		status: QueueStatus.Idle,
		errorMessage: ''
	}
};

const wrapApiError = error => {
	const apiError = asAPIError(error);
	if (apiError) {
		return Promise.reject(new Error(apiError));
	}
	return Promise.reject(error);
};

export const joinDiscoveryQueue = createAsyncThunk('auth/joinQueue', (options: QueueOptions) =>
	client.gateway?.joinDiscoveryQueue(options).catch(wrapApiError));

export const leaveDiscoveryQueue = createAsyncThunk('auth/leaveQueue', () =>
	client.gateway?.leaveDiscoveryQueue().catch(wrapApiError));

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
					localStorage.removeItem('jwt');
				}
			}
		},
		setQueueStatus: (state, action) => {
			state.queue.status = action.payload;
		}
	},
	extraReducers(builder) {
		builder.addCase(joinDiscoveryQueue.pending, state => {
			state.queue.status = QueueStatus.Joining;
		});

		builder.addCase(joinDiscoveryQueue.rejected, (state, action) => {
			state.queue.status = QueueStatus.FailedJoining;
			state.queue.errorMessage = action.error.message as string;
		});

		builder.addCase(leaveDiscoveryQueue.pending, state => {
			state.queue.status = QueueStatus.Leaving;
		});

		builder.addCase(leaveDiscoveryQueue.rejected, (state, action) => {
			state.queue.status = QueueStatus.FailedLeaving;
			state.queue.errorMessage = action.error.message as string;
		});
	}
});

export const { setJWT, setQueueStatus } = AuthSlice.actions;

export const selectJWT = state => state.auth.jwt;

export const selectQueueState = state => state.auth.queue;

export default AuthSlice.reducer;
