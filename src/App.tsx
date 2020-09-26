import React, { useEffect, useState } from 'react';
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
import { Button, createMuiTheme, CssBaseline, IconButton, Snackbar, ThemeProvider } from '@material-ui/core';
import NetworkingPage from './components/routes/networking/NetworkingPage';
import { selectQueueMatch, selectQueueOptions } from './store/slices/AuthSlice';
import AutoAppBar from './components/AutoAppBar';
import DiscordIntroPage from './components/routes/discord/DiscordIntroPage';
import DiscordLinkerPage from './components/routes/discord/DiscordLinkerPage';
import ResetPasswordPage from './components/routes/ResetPassword';
import GDPRPage from './components/legal/GDPRPage';
import CloseIcon from '@material-ui/icons/Close';
import Animated from './components/Animated';

function AppLayer({ children }) {
	const match = useSelector(selectQueueMatch);
	const uxOptions = useSelector(selectQueueOptions);
	const history = useHistory();
	const discordOAuthPage = history.location.pathname.includes('discord_link');

	const [cookiesOpen, setCookiesOpen] = useState(localStorage.getItem('cookies') !== 'yes');

	useEffect(() => {
		history.listen((location, action) => {
			if (action !== 'POP') {
				window.scrollTo(0, 0);
			}
		});
	}, [history]);

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
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				open={cookiesOpen}
				message="We make use of functional cookies"
				action={
					<React.Fragment>
						<Button color="secondary" size="small" onClick={() => {
							localStorage.setItem('cookies', 'yes');
							setCookiesOpen(false);
							history.push('/privacy-policy');
						}}>
              READ MORE
						</Button>
						<IconButton size="small" aria-label="close" color="inherit" onClick={() => {
							localStorage.setItem('cookies', 'yes');
							setCookiesOpen(false);
						}}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
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
								<Route path="/" exact component={Animated(HomePage, 'homepage')} />
								<PublicRoute path="/register" exact component={Animated(RegistrationPage, 'registration')} />
								<PublicRoute path="/login" exact component={Animated(LoginPage, 'login')} />
								<PublicRoute path="/verify" exact component={VerifyEmailPage} />
								<ProtectedRoute path="/account" exact component={Animated(AccountSettingsPage, 'account-settings')} />
								<ProtectedRoute path="/networking" exact component={Animated(NetworkingPage, 'networking')} />
								<ProtectedRoute path="/discord" exact component={Animated(DiscordIntroPage, 'discord-intro')} />
								<Route path="/discord_link" exact component={Animated(DiscordLinkerPage, 'discord-linker')} />
								<Route path="/reset_password" exact component={Animated(ResetPasswordPage, 'password-reset')} />
								<ProtectedRoute path="/chats/:id?/:type?" component={Animated(ChatPage, 'chats')} />
								<Route path="/privacy-policy" exact component={Animated(GDPRPage, 'privacy-policy')} />
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
