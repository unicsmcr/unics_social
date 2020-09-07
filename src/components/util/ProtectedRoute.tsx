import React, { ReactNode } from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectJWT, selectConnected } from '../../store/slices/AuthSlice';
import { initClientGateway, client } from './makeClient';
import { makeStyles, Backdrop, CircularProgress, Typography, Box } from '@material-ui/core';

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
	const jwt = useSelector(selectJWT);
	const connected = useSelector(selectConnected);
	const classes = useStyles();

	let fallback: ReactNode|undefined;
	if (!jwt) {
		fallback = <Redirect to="/login" />;
	} else if (!connected) {
		initClientGateway(client);
		fallback = <Backdrop open={true} className={classes.backdrop}>
			<Typography variant="h4">Connecting...</Typography>
			<Box>
				<CircularProgress color="inherit" />
			</Box>
		</Backdrop>;
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
