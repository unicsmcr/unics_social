import { createSlice } from '@reduxjs/toolkit';

interface AuthSliceState {
	jwt: string|null;
	userId: string|null;
}

const initialState: AuthSliceState = {
	jwt: localStorage.getItem('jwt'),
	userId: null
};

export const AuthSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setJWT: (state, action) => {
			if (action.payload.jwt !== state.jwt) {
				localStorage.setItem('jwt', action.payload.jwt);
				state.jwt = action.payload.jwt;
				state.userId = null;
			}
		}
	}
});

export const { setJWT } = AuthSlice.actions;

export const selectJWT = state => state.auth.jwt;

export default AuthSlice.reducer;
