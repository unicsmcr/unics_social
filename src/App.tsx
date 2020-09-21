import React, { useCallback, useEffect } from 'react';
import store from './store';
import { BrowserRouter, Route, Redirect, Switch, useHistory } from 'react-router-dom';
import HomePage from './components/routes/HomePage';
import RegistrationPage from './components/routes/RegistrationPage';
import LoginPage from './components/routes/LoginPage';
import VerifyEmailPage from './components/routes/VerifyEmailPage';
import AccountSettingsPage from './components/routes/AccountSettings';
import ProtectedRoute from './components/util/ProtectedRoute';
import PublicRoute from './components/util/PublicRoute';
import { Provider, useSelector } from 'react-redux';
import EventPage from './components/routes/EventPage';
import ChatPage from './components/routes/chat/ChatsPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import NetworkingPage from './components/routes/networking/NetworkingPage';
import { selectQueueMatch } from './store/slices/AuthSlice';

function AppLayer({ children }) {
	const match = useSelector(selectQueueMatch);
	const history = useHistory();

	useEffect(() => {
		if (match) {
			history.push(`/chats/${match.channelID}`);
		}
	}, [match, history]);

	return children;
}

function App() {
	return (
		<ThemeProvider theme={createMuiTheme()}>
			<div>
				<Provider store={store}>
					<BrowserRouter>
						<AppLayer>
							<Switch>
								<Route path="/" exact component={HomePage} />
								<PublicRoute path="/register" exact component={RegistrationPage} />
								<PublicRoute path="/login" exact component={LoginPage} />
								<PublicRoute path="/verify" exact component={VerifyEmailPage} />
								<ProtectedRoute path="/account" exact component={AccountSettingsPage} />
								<ProtectedRoute path="/networking" exact component={NetworkingPage} />
								<ProtectedRoute path="/events/:id" exact component={EventPage}/>
								<ProtectedRoute path="/chats/:id?/:type?" component={ChatPage} />
								<Redirect to="/" />
							</Switch>
						</AppLayer>
					</BrowserRouter>
				</Provider>
			</div>
		</ThemeProvider>
	);
}

export default App;
