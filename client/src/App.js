import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import './App.css';
import Alert from './components/layout/Alert'

//REDUX
import { Provider } from 'react-redux'
import store from './store'

//We want the page aside from landing to be inside a container so the routes with compo we wrap within a section with ckass container

const App = () => (
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
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)

export default App;
