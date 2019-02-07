import React, { Component } from 'react';
import user_logo from './resources/user_logo.png';

import './css/User.css';

class User extends Component {
  render() {
    return (
      <div className="user">
        <img src={user_logo} className="userLogo" alt="" />
        <div className="nameHover">{this.props.name}</div>
      </div>
    );
  }
}

export default User;