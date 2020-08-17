import React from "react";

import { Route , Redirect, withRouter } from 'react-router-dom';
interface propsForRouter {
    Component: JSX.Element
    exact: boolean
    path: String
}
const PrivateRouter = (props: propsForRouter): JSX.Element =>  {
    const {Component, ...rest} = props
    return (
        <Route
            {...rest}
            render={props =>
                localStorage.getItem('access-token')  ? <Component />:
                    <Redirect to="/login"/>
            }
        />
    )
}
export default withRouter(PrivateRouter);