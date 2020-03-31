import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPost } from "../../actions/post";
import { Link } from 'react-router-dom'
import PostItem from "../posts/PostItem";
import Spinner from "../layout/Alert";



const Post = ({ getPost, post: { post, loading }, match }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost]);

    return loading || post === null ? (
        <Spinner />
    ) : (
            <Fragment>
                <Link to="/posts" className="btn btn-primary">Back To Posts</Link>
                <PostItem post={post} showActions={false} />
            </Fragment>
        );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
