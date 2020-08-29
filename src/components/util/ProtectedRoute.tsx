import React from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectJWT } from '../../store/slices/AuthSlice';

const ProtectedRoute = props => {
	const { component: Component, ...rest } = props;
	const jwt = useSelector(selectJWT);
	return (
		<Route
			{...rest}
			render={props =>
				jwt
					? <Component {...props} />
					: <Redirect to="/login" />
			}
		/>
	);
};

export default withRouter(ProtectedRoute);
