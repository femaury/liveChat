import React, { Component } from 'react';
import Chat from './Chat'
import User from './User';
import Connection from './Connection';
import io from 'socket.io-client';
import xicon from './resources/x_icon.png';

import './css/App.css';

const ROUTE = 'http://localhost:3000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      modal: false,
      online: [],
      username: 'Anonymous',
      token: ''
    }
    
    this.socket = io('localhost:3000');

    this.socket.on('addOnlineUser', (data) => {
        this.setState({
          online: [...this.state.online, data.username]
        })
    })

    this.socket.on('removeOnlineUser', (data) => {
      const online = this.state.online;
      online.splice(online.indexOf(data.username), 1);
      this.setState({ online });
    })

    this.toggleModal = () => {
      this.setState({ modal: !this.state.modal });
    }

    this.connectUser = () => {
      const username = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (username && token)
        this.setState({ auth: true, modal: false, token, username });
    }

    this.disconnectUser = () => {
      if (this.state.token !== '') {
        this.socket.emit('userDisconnected', {
          username: this.state.username
        })
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
          auth: false,
          modal: false,
          username: 'Anonymous',
          token: ''
        })
      }
    }
  }
  
  componentDidMount() {
    this.connectUser();
    
    fetch(`${ROUTE}/getUsersOnline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      this.setState ({ online: res.online });
    })
  }

  render() {
    return (
      <div className="appContainer">
        {this.state.modal && <Connection toggleModal={this.toggleModal} socket={this.socket} connectUser={this.connectUser} />}
        <div className="dummyWidth" />
        <Chat
          auth={this.state.auth}
          toggleModal={this.toggleModal}
          socket={this.socket}
          username={this.state.username} />
        <div className="scrollWrapper">
          <div className="userContainer">
            { this.state.auth && <div className="disconnect" onClick={this.disconnectUser}><img src={xicon} alt="" title="Disconnect" /></div> }
            { this.state.online.map((name) => {
              if (this.state.username != name)
                return <User name={name} key={name} />
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
