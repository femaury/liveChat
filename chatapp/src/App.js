import React, { Component } from 'react';
import Chat from './Chat'
import User from './User';
import Connection from './Connection';

import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      modal: false,
      online: ["Felix", "Bot", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      users: ["Felix", "Antoine", "Eyal", "Lancelot", "Eloi", "Maxime", "Carl", "Gauthier", "Kevin"]
    }

    this.toggleModal = () => {
      this.setState({ modal: !this.state.modal });
    }
  }
  
  render() {
    return (
      <div className="appContainer">
        {this.state.modal && <Connection toggleModal={this.toggleModal} />}
        <div className="dummyWidth" />
        <Chat auth={this.state.auth} toggleModal={this.toggleModal} />
        <div className="scrollWrapper">
          <div className="userContainer">
            { this.state.online.map((name) => {
              return (
                <User name={name} key={name} />
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
