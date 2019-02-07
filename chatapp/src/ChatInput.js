import React, { Component } from 'react';
import getFormattedDate from './utils/getFormattedDate';

import './css/ChatInput.css';

const ROUTE = 'http://localhost:3000';

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: ''
        }
        
        this.submitInput = (event) => {
            if (event.key === 'Enter')
                this.sendMessage(event);
        }

        this.sendMessage = (event) => {
            if (/\S/.test(this.state.input)) {
                event.preventDefault();
                const token = localStorage.getItem('token');
                const d = getFormattedDate(true);

                this.props.socket.emit('sendMessage', {
                    username: this.props.username,
                    time: d,
                    text: this.state.input,
                    token
                });
                this.setState({ input: '' });
            }
        }
    }

    render() {
        return (
            <div className="chatInputBox">
                <input
                    placeholder="Message..."
                    className="chatInput"
                    value={this.state.input}
                    onChange={(e) => this.setState({ input: e.target.value })}
                    onKeyDown={this.submitInput} />
                <button className="chatSend" onClick={e => this.sendMessage}>Send</button>
            </div>
        );
    }
}

export default ChatInput;