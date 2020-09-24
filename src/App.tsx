import React, { useEffect } from 'react';
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
import ChatPage from './components/routes/chat/ChatsPage';
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import NetworkingPage from './components/routes/networking/NetworkingPage';
import { selectQueueMatch, selectQueueOptions } from './store/slices/AuthSlice';
import AutoAppBar from './components/AutoAppBar';
import DiscordIntroPage from './components/routes/discord/DiscordIntroPage';
import DiscordLinkerPage from './components/routes/discord/DiscordLinkerPage';
import ResetPasswordPage from './components/routes/ResetPassword';

function AppLayer({ children }) {
	const match = useSelector(selectQueueMatch);
	const uxOptions = useSelector(selectQueueOptions);
	const history = useHistory();
	const discordOAuthPage = history.location.pathname.includes('discord_link');

	useEffect(() => {
		if (match) {
			const extra = uxOptions.autoJoinVideo ? '/video' : '';
			history.push(`/chats/${match.channelID}${extra}`);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, history]);

	return discordOAuthPage
		? children
		: <>
			<AutoAppBar />
			{ children }
		</>;
}

function App() {
	return (
		<ThemeProvider theme={createMuiTheme()}>
			<CssBaseline />
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
								<ProtectedRoute path="/discord" exact component={DiscordIntroPage} />
								<Route path="/discord_link" exact component={DiscordLinkerPage} />
								<Route path="/reset_password" exact component={ResetPasswordPage} />
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
