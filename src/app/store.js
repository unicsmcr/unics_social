import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "../features/AuthReducer";
import ChannelsReducer from "../features/ChannelsReducer";
export default configureStore({
    reducer: {
        auth: AuthReducer,
        channels: ChannelsReducer,
    }
})