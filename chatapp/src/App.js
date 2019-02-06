import React, { Component } from 'react';
import Chat from './Chat'
import User from './User';
import Connection from './Connection';
import io from 'socket.io-client';

import './css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      modal: false,
      online: [],
      username: 'Anonymous'
    }
    
    this.socket = io('localhost:3000');

    this.socket.on('userAuth', (data) => {
        this.setState({ online: [...this.state.online, data.username], auth: true, modal: false })
    })

    this.toggleModal = () => {
      this.setState({ modal: !this.state.modal });
    }
  }
  
  componentDidMount() {
    // Check if localStorage has token and change state.
  }

  render() {
    return (
      <div className="appContainer">
        {this.state.modal && <Connection toggleModal={this.toggleModal} socket={this.socket} />}
        <div className="dummyWidth" />
        <Chat auth={this.state.auth} toggleModal={this.toggleModal} socket={this.socket} username={this.state.username} />
        <div className="scrollWrapper">
          <div className="userContainer">
            { this.state.online.map((name) => {
              return <User name={name} key={name} />
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
