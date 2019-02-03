import React, { Component } from 'react';
import Message from './Message';
import './Chat.css';
import io from 'socket.io-client';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            username: 'Wareep',
            input: '',
            messages: [
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'wareep', time: '30/01/19 at 19:47', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'Fuck ydawijd awiojdwaoijdaow idjawoidjwoaidjou.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'},
                { author: 'God', time: '00/00/00 at 00:00', text: 'Hello World!' },
                { author: 'God', time: '00/00/00 at 00:00', text: 'Message...'},
                { author: 'God', time: '00/00/00 at 00:01', text: 'dwaiojdwaoidj waoidjwa oidjwaio djFuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.Fuck you.'}
            ]
        };

        this.socket = io('localhost:3000');

        this.socket.on('receiveMessage', function(data) {
            addMessage(data);
        })

        const addMessage = (data) => {
            this.setState({ messages: [...this.state.messages, data] });
        }

        this.sendMessage = (event) => {
            if (event.key === 'Enter') {
                let d = new Date();
                d = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('' + d.getFullYear()).slice(2) +  " at " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2);
                
                this.socket.emit('sendMessage', {
                    author: this.state.username,
                    time: d,
                    text: this.state.input
                });
                this.setState({ input: '' });
            }
        }

        this.scrollToBottom = () => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }


    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        return (
            <div className="chatContainer">
                <div className="innerChatContainer">
                    <div className="chatTextBox">
                        {this.state.messages.map((msg, i) => {
                            const previous = this.state.messages[i - 1];
                            let author = msg.author;
                            let time = msg.time;

                            if (i !== 0 && author === previous.author &&
                                time.substr(0, 15) === previous.time.substr(0, 15)) {
                                    author = "";
                                    time = "";
                            }
                            return (
                                <Message
                                    author={author}
                                    time={time}
                                    text={msg.text} />
                            );
                        })}
                        <div style={{float: "left", clear: "both"}} ref={(el) => { this.messagesEnd = el }}></div>
                    </div>
                    <div className="chatInputBox">
                        <input
                            placeholder="Message..."
                            className="chatInput"
                            value={this.state.input}
                            onChange={(e) => this.setState({ input: e.target.value }) }
                            onKeyDown={this.sendMessage} />
                        <button className="chatSend">Send</button>
                    </div>
                </div>
                </div>
        );
    }
}

export default Chat;