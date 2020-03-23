import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

//PROTECTING ROUTE
//Privateroute is used to protect route so it redirects user to login page 
//if not authed and renders the compo on the route otherwise

//PASSING PROPS TO COMPO RENDERED BY ROUTE
//if we want to pass props to the compo rendered by ROUTE we use the RENDER prop method whcih takes in a functional component

//PrivateRoute in navbar gets Component prop from inline and auth prop from state which can now be used inside PrivateRoute
//...rest is passed to the returned Route Compo as Prop. And the Component rendered by Route can access it throught props
const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest
}) => (
        <Route
            {...rest}
            render={props =>
                !isAuthenticated && !loading ? (
                    <Redirect to="/login" />
                ) : (
                        <Component {...props} />
                    )
            }
        />
    );

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
