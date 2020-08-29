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
			if (action.payload !== state.jwt) {
				state.jwt = action.payload;

				if (action.payload) {
					localStorage.setItem('jwt', action.payload);
				} else {
					localStorage.removeItem('jwt');
				}
			}
		}
	}
});

export const { setJWT } = AuthSlice.actions;

export const selectJWT = state => state.auth.jwt;

export default AuthSlice.reducer;
