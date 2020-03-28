import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = ({
    profile: {
        user: {
            _id,
            name,
            avatar
        },
        status,
        company,
        location,
        skills
    }
}) => {

    //We Create a button which directs to the route profile/:id that accepts prams
    //we direct when the button is clicked by also passing the profile id to the param
    //whcih will then be used in the user Profile page
    return (
        <div className="profile bg-light">
            <img src={avatar} alt="" className="round-img" />
            <div>
                <h2>{name}</h2>
                <p>
                    {status} {company && <span>at {company}</span>}
                </p>
                <p className="my-1">{location && <span>{location}</span>}</p>
                <Link to={`/profile/${_id}`} className="btn btn-primary">
                    View Profile
                </Link>
            </div>
            <ul>
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className="fas fa-check"></i> {skill}
                    </li>
                ))}
            </ul>
        </div>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileItem;
