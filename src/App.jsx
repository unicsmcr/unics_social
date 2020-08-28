import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import HomePage from './components/routes/HomePage';
import EventsPage from './components/routes/EventsPage';
import ChatPage from './components/routes/ChatPage';
import NetworkingPage from './components/routes/NetworkingPage';
import FriendsPage from './components/routes/FriendsPage';
import RegistrationPage from './components/routes/RegistrationPage';
import LoginPage from './components/routes/LoginPage';
import VerifyEmailPage from './components/routes/VerifyEmailPage';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={HomePage} />
					<Route path="/register" exact component={RegistrationPage} />
					<Route path="/login" exact component={LoginPage} />
					<Route path="/verify" exact component={VerifyEmailPage} />
					<Route path="/events" component={EventsPage} />
					<Route path="/chat" component={ChatPage} />
					<Route path="/friends" component={FriendsPage} />
					<Route path="/networking" component={NetworkingPage} />

					<Redirect to="/" />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
