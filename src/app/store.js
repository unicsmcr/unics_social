import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "../features/AuthSlice";
import EventsListReducer from "../features/EventsListSlice";
export default configureStore({
    reducer: {
        auth: AuthReducer,
        eventsList: EventsListReducer,
    }
})