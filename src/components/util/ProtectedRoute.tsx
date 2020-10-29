import React, { ReactNode, useCallback, useState, useEffect } from 'react';

import { Route, Redirect, withRouter, useHistory, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectJWT, selectConnected } from '../../store/slices/AuthSlice';
import { initClientGateway, client } from './makeClient';
import { makeStyles, Backdrop, CircularProgress, Typography, Box, Button, Fade } from '@material-ui/core';
import { selectMe, fetchMe } from '../../store/slices/UsersSlice';
import { fetchNotes, selectNotesFetched } from '../../store/slices/NotesSlice';

const useStyles = makeStyles(theme => ({
	backdrop: {
		'zIndex': theme.zIndex.drawer + 1,
		'color': '#fff',
		'flexDirection': 'column',
		'textAlign': 'center',
		'& > *': {
			margin: theme.spacing(4, 0)
		},
		'& a': {
			margin: theme.spacing(1, 0)
		}
	}
}));

const ConnectingBackdrop = () => {
	const classes = useStyles();
	const [showMsg, setShowMsg] = useState(false);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setShowMsg(true);
		}, 8000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return <Backdrop open={true} className={classes.backdrop}>
		<Typography variant="h4">Connecting to UniCS KB</Typography>
		<Box>
			<CircularProgress color="inherit" />
		</Box>
		{showMsg && <Fade in>
			<div>
				<Typography variant="subtitle1">
					This seems to be taking longer than usual.
				</Typography>
				<Button variant="contained" color="primary" component={RouterLink} to="/">Take me home</Button>
			</div>
		</Fade>}
	</Backdrop>;
};

const ProtectedRoute = props => {
	const { component: Component, ...rest } = props;
	const dispatch = useCallback(useDispatch(), []);
	const jwt = useSelector(selectJWT);
	const connected = useSelector(selectConnected);
	const me = useSelector(selectMe);
	const haveNotes = useSelector(selectNotesFetched);
	const history = useHistory();

	const isAccountPage = history.location.pathname === '/account';

	useEffect(() => {
		if (!connected) initClientGateway(client);
		if (!me) dispatch(fetchMe());
		if (!haveNotes) dispatch(fetchNotes());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	let fallback: ReactNode|undefined;
	if (jwt && (!me || !connected || !haveNotes)) {
		fallback = <ConnectingBackdrop />;
	} else if (jwt && me && !me.profile && !isAccountPage) {
		fallback = <Redirect to="/account?promptSetup" />;
	}	else if (!jwt) {
		fallback = <Redirect to="/login" />;
	}

	return (
		<Route
			{...rest}
			render={props =>
				fallback ?? <Component {...props} />
			}
		/>
	);
};

export default withRouter(ProtectedRoute);
