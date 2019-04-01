import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Import API requests
import { getUserAccount, getUserLogout } from "../apiRequests";

// Import components
import Nav from "./Navigation/Nav";
import Landing from "./Landing";
import Videos from "./Video/Videos";
import Account from "./User/Account";
import SignUpForm from "./Form/SignUpForm";
import LoginForm from "./Form/LoginForm";
import NotFound404 from "./Misc/NotFound404";

class App extends Component {
  state = {
    loggedIn: false
  }
  
  /* ### TODO ###

    1: Add twitter functionality

    2: Add backend functionality for creating videos and notes

    3: Write tests for the backend

  */

  componentDidMount() {
    getUserAccount(({ data }) => {
      if (data.status === 200) {
        this.setLoggedInStatus(true);
      } else {
        this.setLoggedInStatus(false);
      }
    });
  }

  navItems = () => {
    const items = [];

    if (this.state.loggedIn) {
      items.push(
        { title: "Home", to: "/", icon: "home" },
        { title: "Videos", to: "/videos", icon: "document" },
        { title: "Account", to: "/account", icon: "account" },
        { title: "Logout", to: "/logout", icon: "home" },
      );
    } else {
      items.push(
        { title: "Login", to: "/login", icon: "home"},
        { title: "Sign Up", to: "/signup", icon: "home"}
      );
    }

    return items;
  }

  setLoggedInStatus = bool => this.setState({ loggedIn: bool })

  render() {
    return (
      <BrowserRouter>
        <Nav navItems={this.navItems()} />
        <div className="container-fluid">
          <div className="row">  
            <main role="main" className="col-md-9 mx-auto col-lg-10 mt-5">
              <Switch>
                <Route exact path="/" component={Landing} />

                {/* Logged Out Routes */}
                <Route exact path="/signup" component={({ history }) =>
                  <SignUpForm
                    setLoggedInStatus={() => this.setLoggedInStatus}
                  />
                } />
                <Route exact path="/login" component={({ history }) => 
                  <LoginForm
                    setLoggedInStatus={() => this.setLoggedInStatus}
                  />
                } />

                {/* Logged In Routes */}
                <Route exact path="/videos" component={({ history }) => 
                  <Videos
                    history={history}
                    setLoggedInStatus={() => this.setLoggedInStatus}
                  />
                } />
                <Route exact path="/account" component={({ history }) => 
                  <Account
                    history={history}
                    setLoggedInStatus={() => this.setLoggedInStatus}
                  />
                } />
                <Route exact path="/logout" component={({ history }) => {
                  getUserLogout(() => {
                    this.setLoggedInStatus(false);
                    return history.push("/");
                  });

                  return null;
                }} />
                <Route component={NotFound404} />
              </Switch>
            </main>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;