import React, { Component } from 'react';
import getFormattedDate from './utils/getFormattedDate';
import xicon from './resources/x_icon.png';

import './css/ChatInput.css';

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            isTyping: false
        }
        
        this.onChange = (event) => {
            const input = event.target.value;
            
            this.setState({ input });
            if (input.length > 0 && this.state.isTyping === false) {
                this.setState({ isTyping: true });
                this.props.updateTyping();
            } else if (input.length === 0 && this.state.isTyping === true) {
                this.setState({ isTyping: false});
                this.props.updateTyping();
            }
        }

        this.submitInput = (event) => {
            if (event.key === 'Enter') {
                this.sendMessage(event);
            }
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
                this.setState({ input: '', isTyping: false });
                this.props.updateTyping();
            }
        }
    }

    render() {
        const button = this.props.mobile ?
            <button className="disconnectMobile" onClick={this.props.disconnectUser}><img alt='' src={xicon} /></button> :
            <button className="chatSend" onClick={this.sendMessage}>Send</button>;

        return (
            <div className="chatInputBox">
                <input
                    placeholder="Message..."
                    className="chatInput"
                    maxLength="65000"
                    value={this.state.input}
                    onChange={this.onChange}
                    onKeyDown={this.submitInput} />
                {button}
            </div>
        );
    }
}

export default ChatInput;