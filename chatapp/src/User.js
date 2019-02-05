import React, { Component } from 'react';
import user_logo from './resources/user_logo.png';

import './css/User.css';

class User extends Component {
  render() {
    return (
      <div className="user">
        <img src={user_logo} className="userLogo" alt="" />
      </div>
    );
  }
}

export default User;