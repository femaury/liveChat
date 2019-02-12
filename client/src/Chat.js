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
            limit: LIMIT_STEP,
            typing: []
        };

        this.props.socket.on('receiveMessage', (data) => {
            this.setState({ messages: [...this.state.messages, data] });
            
            if (typeof Notification !== 'undefined' && data.username !== 'CO' && data.username !== localStorage.getItem('user')) {
                new Notification("Soir chat new message", {
				    body: `${data.username}: ${data.text}`,
				    icon: "https://soir.wtf/favicon.png"
                });
            }
        })

        this.props.socket.on('updateTyping', (data) => {
            const typing = this.state.typing;
            
            if (typing.includes(data.username))
                typing.splice(typing.indexOf(data.username), 1);
            else 
                typing.push(data.username);
            this.setState({ typing });
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

        this.updateTyping = () => {
            this.props.socket.emit('userTyping');
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
            <ChatInput
                socket={this.props.socket}
                username={this.props.username}
                updateTyping={this.updateTyping}
                disconnectUser={this.props.disconnectUser}
                mobile={this.props.mobile} /> :
            <div className="connectBar" onClick={this.props.toggleModal}>JOIN THE CHAT</div>;

        let userTyping = '';
        if (this.state.typing.length === 1)
            userTyping = this.state.typing[0] + " is typing...";
        else if (this.state.typing.length === 2)
            userTyping = this.state.typing[0] + " and " + this.state.typing[1] + " are typing...";
        else if (this.state.typing.length > 2)
            userTyping = this.state.typing.length + " users are typing..."

        return (
            <div className="chatContainer">
                <div className="innerChatContainer">
                    <div className="chatTextBox" id="scroll" ref="messageList" onScroll={this.onScroll}>
                        {this.state.messages.map((msg, i) => {
                            let author = msg.username;
                            let time = msg.time;
                            const previous = this.state.messages[i - 1];

                            if (author === 'CO') {
                                const id = msg.text.includes('joined') ? 'joined' : 'left';

                                return (
                                    <div className="connectionMsg">
                                        <div className="connectionTxt" id={id}>{msg.text}</div>
                                    </div>
                                );
                            }

                            if (i !== 0 && author === previous.username &&
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
                    {userTyping !== '' && <div className="userTyping">{userTyping}</div>}
                    {bottomBar}
                </div>
            </div>
        );
    }
}

export default Chat;
