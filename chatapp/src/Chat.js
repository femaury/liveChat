import React, { Component } from 'react';
import Message from './Message';
import './Chat.css';
import io from 'socket.io-client';

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
                d = getDate(true);

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

function compareTime(prev, curr) {
    const prevMins = parseInt(prev.substr(15));
    const mins = parseInt(curr.substr(15));

    if (prev.substr(0, 15) === curr.substr(0, 15) &&
      mins <= prevMins + 2 &&
      mins >= prevMins - 2) {
        return true;
    }
    return false;
}

function formatTime(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let today = new Date();
    let otherDay = invertMonthDay(date.substr(0, 8));
    const dayOfWeek = today.getDay();

    const diff = Math.abs(daysDiff(new Date(otherDay), today));

    switch (diff) {
        case 0:
            return date.substr(12);
        case 1:
            return "Yesterday " + date.substr(9);
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return "Last " + days[(((dayOfWeek - diff) % 7) + 7) % 7] + date.substr(9);
        default:
            return date.substr(0, 8); 
    }
}

function getDate(hours) {
    var d = new Date();

    var dd = ('0' + d.getDate()).slice(-2);
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    var yy = ('' + d.getFullYear()).slice(2);

    if (hours) {
        var hh = ('0' + d.getHours()).slice(-2);
        var min = ('0' + d.getMinutes()).slice(-2);
        var today = dd + '/' + mm + '/' + yy + ' at ' + hh + ':' + min;
    } else {
        var today = dd + '/' + mm + '/' + yy;
    }
    return today;
}

function invertMonthDay(date) {
    const dd = date.slice(0, 3);
    const mm = date.slice(3, 6);
    const yy = date.slice(6);
    return mm.concat(dd, yy);
}

function daysDiff(date1, date2) {
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
    return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
}

export default Chat;