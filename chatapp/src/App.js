import React, { Component } from 'react';
import './App.css';
import Chat from './Chat'

class App extends Component {
  render() {
    return (
      <div className="appContainer">
        <Chat />
      </div>
    );
  }
}

export default App;
