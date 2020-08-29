import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import EventsListReducer from './slices/EventsListSlice';
import ChannelListReducer from './slices/ChannelsSlice';

export default configureStore({
	reducer: {
		auth: AuthReducer,
		eventsList: EventsListReducer,
		channels: ChannelListReducer
	}
});
