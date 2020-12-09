import React from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectJWT } from '../../store/slices/AuthSlice';

const PublicRoute = props => {
	const { component: Component, ...rest } = props;
	const jwt = useSelector(selectJWT);

	// Note: user will be redirected to /account if their profile is not set
	const userLandingPage = '/chats';

	return (
		<Route
			{...rest}
			render={props =>
				jwt
					? <Redirect to={userLandingPage} />
					: <Component {...props} />
			}
		/>
	);
};

export default withRouter(PublicRoute);
