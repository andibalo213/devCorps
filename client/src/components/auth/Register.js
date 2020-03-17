import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'

const Register = ({ setAlert, register }) => {


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    })

    const { name, email, password, password2 } = formData;

    const onChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })

        console.log(formData[e.target.name])
    }

    const onSubmit = (e) => {

        e.preventDefault()

        if (password !== password2) {
            //set alert receives arguments and dispacthes the action that is evaluated by reducer/rootreducer
            //and reducer makes cahnges to the store state
            setAlert("passwords does not match", "danger", 3000)
        } else {
            register(name, email, password)
        }
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => onChange(e)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e) => onChange(e)} />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"

                        value={password} onChange={(e) => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"

                        value={password2} onChange={(e) => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

//1. In connect the first param is state from store/redux that is connected to this compoenent
//2. second param are object of actions(functions) that are connected to this compo
//3. by passing the action it is available to this compo(Register) as props so we can access it by passing
//   props as argumen to this compo and accessing actions by props.action
export default connect(null, { setAlert, register })(Register)