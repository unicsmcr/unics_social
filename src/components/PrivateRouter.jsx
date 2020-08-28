import React from 'react';

import { Route, Redirect, withRouter } from 'react-router-dom';


const PrivateRouter = props => {
	const { Component, ...rest } = props;
	return (
		<Route
			{...rest}
			render={() =>
				localStorage.getItem('access-token')
					? <Component />
					: <Redirect to="/login" />
			}
		/>
	);
};
export default withRouter(PrivateRouter);
