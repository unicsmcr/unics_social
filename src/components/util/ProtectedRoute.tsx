import React, { ReactNode, useCallback, useEffect } from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectJWT, selectConnected } from '../../store/slices/AuthSlice';
import { initClientGateway, client } from './makeClient';
import { makeStyles, Backdrop, CircularProgress, Typography, Box } from '@material-ui/core';
import { selectMe, fetchMe } from '../../store/slices/UsersSlice';

const useStyles = makeStyles(theme => ({
	backdrop: {
		'zIndex': theme.zIndex.drawer + 1,
		'color': '#fff',
		'flexDirection': 'column',
		'& > *': {
			margin: theme.spacing(4, 0)
		}
	}
}));

const ProtectedRoute = props => {
	const { component: Component, ...rest } = props;
	const dispatch = useCallback(useDispatch(), []);
	const jwt = useSelector(selectJWT);
	const connected = useSelector(selectConnected);
	const me = useSelector(selectMe);
	const classes = useStyles();

	useEffect(() => {
		if (!connected) initClientGateway(client);
		if (!me) dispatch(fetchMe());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	let fallback: ReactNode|undefined;
	if (jwt && (!me || !connected)) {
		fallback = <Backdrop open={true} className={classes.backdrop}>
			<Typography variant="h4">Connecting to UniCS KB</Typography>
			<Box>
				<CircularProgress color="inherit" />
			</Box>
		</Backdrop>;
	} else if (!jwt) {
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
