import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import UsersReducer from './slices/UsersSlice';
import MessagesReducer from './slices/MessagesSlice';
import ChannelListReducer from './slices/ChannelsSlice';
import ReadReducer from './slices/ReadSlice';
import NotesReducer from './slices/NotesSlice';

export default configureStore({
	reducer: {
		auth: AuthReducer,
		users: UsersReducer,
		channels: ChannelListReducer,
		messages: MessagesReducer,
		read: ReadReducer,
		notes: NotesReducer
	}
});
