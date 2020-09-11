import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import UsersReducer from './slices/UsersSlice';
import EventsListReducer from './slices/EventsSlice';
import ChannelListReducer from './slices/ChannelsSlice';

export default configureStore({
	reducer: {
		auth: AuthReducer,
		users: UsersReducer,
		events: EventsListReducer,
		channels: ChannelListReducer
	}
});
