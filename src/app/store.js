import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "../features/AuthSlice";
import ChannelsReducer from "../features/ChannelsReducer";
export default configureStore({
    reducer: {
        auth: AuthReducer,
        channels: ChannelsReducer,
    }
})