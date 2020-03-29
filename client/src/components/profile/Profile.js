import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfileById } from "../../actions/profile";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import ProfileGithub from './ProfileGithub'
import Experience from "../dashboard/Experience";


const Profile = ({
    profile: { profile, loading },
    auth,
    getProfileById,
    match
}) => {
    //MATCH PROP
    //component rendered by Route will receive history,render and match as prop
    //match is used to take params/query string from the url

    //We use match to take the profile id from the url and give it to getProfilebyId action
    //which then makes a request to the backend route and return the corresponing profile id data and saves it to the
    //profile state

    //AUTH STATE
    //is used to display edit btn if user is logged in and if the user id from auth state matches ths user id from auth state

    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match.params.id]);

    return (
        <Fragment>
            {profile === null || loading ? (
                <Spinner />
            ) : (
                    <Fragment>
                        <Link to="/profiles" className="btn btn-light">
                            Back To Profiles
                        </Link>
                        {auth.isAuthenticated &&
                            auth.loading === false &&
                            auth.user._id === profile.user._id && (
                                <Link to="/edit-profile" className="btn btn-dark">
                                    Edit Profile
                                </Link>
                            )}
                        <div className="profile-grid my-1">
                            <ProfileTop profile={profile} />
                            <ProfileAbout profile={profile} />
                            <div className="profile-exp bg-white p-2">
                                <h2 className="text-primary">Experience</h2>
                                {profile.experience.length > 0 ? (
                                    <Fragment>
                                        {profile.experience.map(experience => (
                                            <ProfileExperience key={experience._id} experience={experience} />
                                        ))}
                                    </Fragment>
                                ) : (
                                        <h4>No Experience Credentials</h4>
                                    )}
                            </div>
                            <div className="profile-edu bg-white p-2">
                                <h2 className="text-primary">Education</h2>
                                {profile.education.length > 0 ? (
                                    <Fragment>
                                        {profile.education.map(education => (
                                            <ProfileEducation key={education._id} education={education} />
                                        ))}
                                    </Fragment>
                                ) : (
                                        <h4>No Education Credentials</h4>
                                    )}
                            </div>
                            {profile.githubusername && (<ProfileGithub username={profile.githubusername} />)}
                        </div>
                    </Fragment>
                )}
        </Fragment>
    );
};

Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    getProfileById: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
