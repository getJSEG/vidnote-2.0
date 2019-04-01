import React, { Component } from "react";

// Import API requests
import { getUserAccount, postUserSignup } from "../../apiRequests";

// Import components
import Error from "../Misc/Error";

class SignUpForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: {},
    onlyShowMessage: false
  }

  componentDidMount() {
    getUserAccount(({ data }) => {
      if (data.status === 200) {
        this.setState({
          error: {
            message: "You are already signed in."
          },
          onlyShowErrorMessage: true
        });

        this.props.setLoggedInStatus(true);
      } else {
        this.setState({
          error: null,
          onlyShowErrorMessage: false
        });

        this.props.setLoggedInStatus(false);
      }
    });
  }

  handleInputChange = ({ target }) => this.setState({ [target.name]: target.value });

  handleSubmit = e => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = this.state;

    postUserSignup({ name, email, password, confirmPassword }, ({ data }) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ error: null });
          this.props.setLoggedInStatus(true);
          window.location.pathname = "/";
        }
      });
  }

  render() {
    let isMongoDuplicateError = false;
    let error = "";

    // Error messages
    if (this.state.error !== null) {
      // Checks that a user does not already exist with the credentials provided 
      if ("code" in this.state.error) {
        isMongoDuplicateError = this.state.error.code === 11000;
      }

      if (isMongoDuplicateError) {
        error = "Oops, it looks like that account already exists. Try logging in."
      } else {
        error = this.state.error.message;
      }
    }
    
    if (this.state.onlyShowErrorMessage) {
      return (
        <div className="col-md-6 mx-auto mt-5">
          <Error error={error} />
        </div>
      );
    } else {
      return (
        <div className="col-md-6 mx-auto mt-5">
          <h1 className="mb-5">Sign Up for vdNote!</h1>
  
          <Error error={error} />
  
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" name="name" id="name" placeholder="Name"  
                value={this.state.name}
                onChange={this.handleInputChange}
                />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" className="form-control" name="email" id="email" placeholder="Enter email"  
                value={this.state.email}
                onChange={this.handleInputChange}
                />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" name="password" id="password" placeholder="Password" 
                value={this.state.password}
                onChange={this.handleInputChange}
                />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" 
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
                />
            </div>
  
            <button type="submit" className="btn text-white">Sign Up</button>
          </form>
        </div>
      );
    }
  }
}

export default SignUpForm;