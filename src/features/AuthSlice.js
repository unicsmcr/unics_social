import {createSlice} from '@reduxjs/toolkit'
export const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        isSignedIn: false
    },
    reducers: {
        SIGN_IN: state =>{
            state.isSignedIn = true
        },
        SIGN_OUT: state => state.isSignedIn = false
    }
})

// the reducers the application will have
// passed to the dispatch hook
// when called the form will be dispatch(methodName(payload))
export const {SIGN_IN, SIGN_OUT} = AuthSlice.actions

// passed to the selector hook
// selector(selectSignedIn) returns the auth slice value
export const selectSignedIn = state => state.auth
export default AuthSlice.reducer