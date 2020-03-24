import React, { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './components/routing/PrivateRoute'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css';
import Alert from './components/layout/Alert'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import AddExperience from './components/profile-forms/AddExperience'
import AddEducation from './components/profile-forms/AddEducation'
//REDUX
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken'
import { loadUser } from './actions/auth'
//We want the page aside from landing to be inside a container so the routes with compo we wrap within a section with ckass container

if (localStorage.token) {
  setAuthToken(localStorage.token) //sets token to req header as global header
}


const App = () => {

  //WE WANT TO HIT THE BACKEND THAT AUTHS USER AND RETURN USER DATA EVERYTIME PAGE LOAD
  //in order to do that we use useEffect which is similar to lifecycle method and rn the loadUser action whcih
  //send req to endpoint that returns user everytime the page load

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])  // placing empty array as second arg in useEffect makes the effect only run once onmount and unmount (Like componentdidmount/unmount)

  return (
    <Provider store={store}>
      <Router>
        <Fragment >
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
              <PrivateRoute exact path="/add-education" component={AddEducation} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
