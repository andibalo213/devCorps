import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Education from './Education'
import Experience from './Experience'

//In the dashboard route we want to load the current user profile into state on page load
//we do that using useEffect hook and calling the getCurrentUser action
//we connect this compo to the auth state to check if user is authenticated and profile state to get the current user profile
const Dashboard = ({
    deleteAccount,
    getCurrentProfile,
    auth: { user },
    profile: { profile, loading }
}) => {
    //by passing an empty array as second arg we only run the useEffect funtion once
    useEffect(() => {
        getCurrentProfile();
    }, []);

    //SHOW SPINNER WHEN DOCUMENT NOT READY
    //we will show spinner when the rbowser has not finished getting the profile data from dashboard
    //by checking the Profile State if loading is false and profile null

    //CLEAR PROFILE ON LOGOUT
    //when we login we get the logged in user profile but when user logout the profile state is still the logged out user
    //because the dom doesnt mount/unmoun which resets the profile state to inital state but updates.
    //so we need to create an action which clears profile on logout

    return loading && profile === null ? (
        <Spinner />
    ) : (
            <Fragment>
                <h1 className="large text-primary">Dashboard</h1>
                <p className="lead">
                    <i className="fas fa-user"></i> Welcome {user && user.name}
                </p>
                {profile ? (
                    <Fragment>
                        <DashboardActions />
                        <Experience experience={profile.experience} />
                        <Education education={profile.education} />
                        <div className="my-2">
                            <button className="btn btn-danger" onClick={e => deleteAccount()}><i className="fas fa-user-minus"></i> Delete My Account</button>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            <p>You do not have a profile yet, let's get you started!</p>
                            <Link to="/create-profile" className="btn btn-primary my-1">
                                Create Profile
                            </Link>
                        </Fragment>
                    )}
            </Fragment>
        );
};

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
