import React, { Component } from 'react';
import Message from './Message';
import './Chat.css';
import io from 'socket.io-client';
import compareTime from './utils/compareTime';
import getFormattedDate from './utils/getFormattedDate';
import formatTime from './utils/formatTime';

const ROUTE = 'http://localhost:3000';
const LIMIT_STEP = 50;

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            username: 'Meme Lord',
            input: '',
            messages: [],
            limit: LIMIT_STEP
        };

        this.socket = io('localhost:3000');

        this.socket.on('receiveMessage', function(data) {
            addMessage(data);
        })

        const addMessage = (data) => {
            this.setState({ messages: [...this.state.messages, data] });
        }

        this.submitInput = (event) => {
            if (event.key === 'Enter')
                this.sendMessage(event);
        }

        this.sendMessage = (event) => {
            if (/\S/.test(this.state.input)) {
                event.preventDefault();
                let d = new Date();
                d = getFormattedDate(true);

                this.socket.emit('sendMessage', {
                    user_name: this.state.username,
                    time: d,
                    text: this.state.input
                });
                this.setState({ input: '' });
            }
        }

        this.onScroll = () => {
            const { refs } = this;
            const scrollTop = refs.messageList.scrollTop;
            if (scrollTop === 0) {
                const limit = this.state.limit + LIMIT_STEP;
                if (limit > this.state.messages.length + LIMIT_STEP)
                    return;
                this.setState({
                    limit
                })
                this.fetchHistory(limit);
            }
        }

        this.fetchHistory = (limit) => {
            fetch(`${ROUTE}/chatMessages`, {
                method: 'POST',
                body: JSON.stringify({
                    limit: limit,
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(response => response.json())
            .then(chatMsg => {
                this.setState({
                    messages: chatMsg
                })
            })
        }
    }

    static scrollAtBottom = true;

    componentDidMount() {
        this.fetchHistory(this.state.limit)
        this.messagesEnd.scrollIntoView();
    }

    componentWillUpdate(_, nextState) {
        this.historyChanged = nextState.messages.slice(0, LIMIT_STEP) !== this.state.messages.slice(0, LIMIT_STEP);
        if (this.historyChanged) {
            console.log('test');
            const { messageList } = this.refs;
            const scrollPos = messageList.scrollTop;
            const scrollBottom = (messageList.scrollHeight - messageList.clientHeight);
            this.scrollAtBottom = (scrollBottom <= 0) || (scrollPos === scrollBottom);
            if (!this.scrollAtBottom) {
                const numMessages = messageList.childNodes.length;
                const index = this.state.limit - numMessages;
                this.topMessage = messageList.childNodes[index];
            }
        }
    }

    componentDidUpdate() {
        if (this.historyChanged) {
            if (this.scrollAtBottom)
                this.messagesEnd.scrollIntoView();
            else if (this.topMessage)
                this.topMessage.scrollIntoView();
        }
    }

    render() {
        return (
            <div className="chatContainer">
                <div className="innerChatContainer">
                    <div className="chatTextBox" id="scroll" ref="messageList" onScroll={this.onScroll}>
                        {this.state.messages.map((msg, i) => {
                            let author = msg.user_name;
                            let time = msg.time;
                            const previous = this.state.messages[i - 1];

                            if (i !== 0 && author === previous.user_name &&
                                compareTime(previous.time, time)) {
                                author = "";
                                time = "";
                            } else {
                                time = formatTime(time);
                            }

                            return (
                                <Message
                                    author={author}
                                    time={time}
                                    text={msg.text}
                                    key={i} />
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
                            onKeyDown={this.submitInput} />
                        <button className="chatSend" onClick={this.sendMessage}>Send</button>
                    </div>
                </div>
                </div>
        );
    }
}

export default Chat;