import React from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectJWT } from '../../store/slices/AuthSlice';

const PublicRoute = props => {
	const { component: Component, ...rest } = props;
	const jwt = useSelector(selectJWT);
	return (
		<Route
			{...rest}
			render={() =>
				jwt
					? <Redirect to="/account" />
					: <Component />
			}
		/>
	);
};

export default withRouter(PublicRoute);
