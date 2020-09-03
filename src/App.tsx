import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import HomePage from './components/routes/HomePage';
import RegistrationPage from './components/routes/RegistrationPage';
import LoginPage from './components/routes/LoginPage';
import VerifyEmailPage from './components/routes/VerifyEmailPage';
import AccountSettingsPage from './components/routes/AccountSettings';
import ProtectedRoute from './components/util/ProtectedRoute';
import PublicRoute from './components/util/PublicRoute';
import { Provider } from 'react-redux';
import store from './store';
import EventPage from './components/routes/EventPage';

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
						<ProtectedRoute path="/event/:id?" exact component={EventPage}/>
						<Redirect to="/" />
					</Switch>
				</BrowserRouter>
			</Provider>
		</div>
	);
}

export default App;
