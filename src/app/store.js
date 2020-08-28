import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../features/AuthSlice';
import EventsListReducer from '../features/EventsListSlice';
import ChannelListReducer from '../features/ChannelsSlice';
export default configureStore({
	reducer: {
		auth: AuthReducer,
		eventsList: EventsListReducer,
		channels: ChannelListReducer
	}
});
