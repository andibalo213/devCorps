import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
    experience: { company, title, location, current, to, from, description }
}) => {
    return (
        <div>
            <h3 className="text-dark">{company}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
                {current ? (
                    <span>Current</span>
                ) : (
                        <Moment format="YYYY/MM/DD">{to}</Moment>
                    )}
            </p>
            <p>
                <strong>Location: </strong> {location ? location : (<span>-</span>)}
            </p>
            <p>
                <strong>Position: </strong> {title ? title : (<span>-</span>)}
            </p>
            <p>
                <strong>Description: </strong> {description ? description : (<span>-</span>)}
            </p>
        </div>
    );
};

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired
};

export default ProfileExperience;
