import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import ChannelsReducer from './ChannelsReducer';

const reducers = combineReducers({
    auth: AuthReducer,
    channels: ChannelsReducer,

});

export default reducers;
