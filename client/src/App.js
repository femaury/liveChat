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
      token: '',
      width: window.innerWidth
    }
    
    this.socket = io(ROUTE);

    this.socket.on('updateOnlineUsers', (data) => {
      this.setState({ online: data.online })
    })

    this.toggleModal = () => {
      this.setState({ modal: !this.state.modal });
    }

    this.connectUser = () => {
      const username = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (username && token) {
        this.setState({ auth: true, modal: false, token, username });
        this.socket.emit('userConnected', { username });
      }
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

    this.handleWindowSize = () => {
      this.setState({ width: window.innerWidth });
    }
  }
  
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSize);
  }

  componentDidMount() {
    this.connectUser();
    if (typeof Notification !== 'undefined')
	    Notification.requestPermission();
    
    fetch(`${ROUTE}/getOnlineUsers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(res => {
      this.setState ({ online: res.online });
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSize);
  }

  render() {
    const mobile = this.state.width <= 500;

    return (
      <div className="appContainer">
        {this.state.modal && <Connection toggleModal={this.toggleModal} socket={this.socket} connectUser={this.connectUser} />}
        {!mobile && <div className="dummyWidth" />}
        <Chat
          auth={this.state.auth}
          toggleModal={this.toggleModal}
          socket={this.socket}
          username={this.state.username}
          disconnectUser={this.disconnectUser}
          mobile={mobile} />
        {!mobile && <div className="scrollWrapper">
          <div className="userContainer">
            { this.state.auth && <div className="disconnect" onClick={this.disconnectUser}><img src={xicon} alt="" title="Disconnect" /></div> }
            { this.state.online.map((name) => {
              if (this.state.username !== name)
                return <User name={name} key={name} />
              return null;
            })}
          </div>
        </div>}
      </div>
    );
  }
}

export default App;
