import React, { ReactNode } from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectJWT, selectConnected } from '../../store/slices/AuthSlice';
import { initClientGateway, client } from './makeClient';

const ProtectedRoute = props => {
	const { component: Component, ...rest } = props;
	const jwt = useSelector(selectJWT);
	const connected = useSelector(selectConnected);

	let fallback: ReactNode|undefined;
	if (!jwt) {
		fallback = <Redirect to="/login" />;
	} else if (!connected) {
		initClientGateway(client);
		fallback = <h2>Connecting to gateway...</h2>;
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
