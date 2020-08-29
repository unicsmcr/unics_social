import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import HomePage from './components/routes/HomePage';
import RegistrationPage from './components/routes/RegistrationPage';
import LoginPage from './components/routes/LoginPage';
import VerifyEmailPage from './components/routes/VerifyEmailPage';
import AccountSettingsPage from './components/routes/AccountSettings';

function App() {
	return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={HomePage} />
					<Route path="/register" exact component={RegistrationPage} />
					<Route path="/login" exact component={LoginPage} />
					<Route path="/verify" exact component={VerifyEmailPage} />
					<Route path="/account" exact component={AccountSettingsPage} />
					<Redirect to="/" />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
