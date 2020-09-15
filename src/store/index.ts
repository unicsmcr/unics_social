import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import UsersReducer from './slices/UsersSlice';
import MessagesReducer from './slices/MessagesSlice';
import EventsListReducer from './slices/EventsSlice';
import ChannelListReducer from './slices/ChannelsSlice';
import ReadReducer from './slices/ReadSlice';

export default configureStore({
	reducer: {
		auth: AuthReducer,
		users: UsersReducer,
		events: EventsListReducer,
		channels: ChannelListReducer,
		messages: MessagesReducer,
		read: ReadReducer
	}
});
