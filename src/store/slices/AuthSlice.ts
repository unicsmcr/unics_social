import { createSlice } from '@reduxjs/toolkit';

interface AuthSliceState {
	jwt: string|null;
}

const initialState: AuthSliceState = {
	jwt: localStorage.getItem('jwt')
};

export const AuthSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setJWT: (state, action) => {
			if (action.payload.jwt !== state.jwt) {
				localStorage.setItem('jwt', action.payload.jwt);
				state.jwt = action.payload.jwt;
			}
		}
	}
});

export const { setJWT } = AuthSlice.actions;

export const selectJWT = state => state.auth.jwt;

export default AuthSlice.reducer;
