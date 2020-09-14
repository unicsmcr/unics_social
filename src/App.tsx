import React from 'react';
import store from './store';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import HomePage from './components/routes/HomePage';
import RegistrationPage from './components/routes/RegistrationPage';
import LoginPage from './components/routes/LoginPage';
import VerifyEmailPage from './components/routes/VerifyEmailPage';
import AccountSettingsPage from './components/routes/AccountSettings';
import ProtectedRoute from './components/util/ProtectedRoute';
import PublicRoute from './components/util/PublicRoute';
import { Provider } from 'react-redux';
import EventPage from './components/routes/EventPage';
import ChatPage from './components/routes/chat/ChatsPage';

function App() {
	return (
		<div>
			<Provider store={store}>
				<BrowserRouter>
					<Switch>
						<Route path="/" exact component={HomePage} />
						<PublicRoute path="/register" exact component={RegistrationPage} />
						<PublicRoute path="/login" exact component={LoginPage} />
						<PublicRoute path="/verify" exact component={VerifyEmailPage} />
						<ProtectedRoute path="/account" exact component={AccountSettingsPage} />
						<ProtectedRoute path="/events/:id" exact component={EventPage}/>
						<ProtectedRoute path="/chats/:id?" component={ChatPage} />
						<Redirect to="/" />
					</Switch>
				</BrowserRouter>
			</Provider>
		</div>
	);
}

export default App;
