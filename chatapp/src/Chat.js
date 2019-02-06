import React, { Component } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import compareTime from './utils/compareTime';
import formatTime from './utils/formatTime';

import './css/Chat.css';

const ROUTE = 'http://localhost:3000';
const LIMIT_STEP = 50;


class Chat extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            input: '',
            messages: [],
            limit: LIMIT_STEP
        };

        this.props.socket.on('receiveMessage', (data) => {
            this.setState({ messages: [...this.state.messages, data] });
        })

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
                    limit
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
        const bottomBar = this.props.auth ?
            <ChatInput socket={this.props.socket} username={this.props.username} /> :
            <div className="connectBar" onClick={this.props.toggleModal}>JOIN THE CHAT</div>;

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

                            return <Message author={author} time={time} text={msg.text} key={i} />;
                        })}
                        <div style={{float: "left", clear: "both"}} ref={(el) => { this.messagesEnd = el }}></div>
                    </div>
                    {bottomBar}
                </div>
            </div>
        );
    }
}

export default Chat;