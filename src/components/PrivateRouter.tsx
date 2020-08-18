import React, { ElementType, FunctionComponent } from "react";

import { Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';

interface propsForRouter extends RouteComponentProps {
    Component: ElementType
    exact: boolean
    path: string
}

const PrivateRouter: FunctionComponent<propsForRouter> = (props) => {
    const { Component, ...rest } = props
    return (
        <Route
            {...rest}
            render={props =>
                localStorage.getItem('access-token') ? <Component /> :
                    <Redirect to="/login" />
            }
        />
    )
}
export default withRouter(PrivateRouter);
