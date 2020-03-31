import React, { useState } from "react";
import PropTypes from "prop-types";
import { addPost } from "../../actions/post";
import { connect } from "react-redux";

const PostForm = ({ addPost }) => {
    const [text, setText] = useState("");

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form
                className="form my-1"
                onSubmit={e => {
                    e.preventDefault()

                    //TEXTDATA NEEDS TO BE WRAPPED IN OBJ
                    //when sending data to the server the data must be wrapped in obj because the http communications
                    //work with json format

                    //FIELDS SENT FROM CLIENT MuST MATCH THE THE FIELDS THAT SERVER TAkES FROM REQ.BODY
                    //by sending textData as obj to the action that hits the post endpoint, it will result in error
                    //because the endpoint takes takes a field called text from req.body.
                    //addPost({ textData });

                    addPost({ text });
                    setText("");
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Create a post"
                    required
                ></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
