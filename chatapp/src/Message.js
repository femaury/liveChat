import React from 'react';
import './Message.css';

function Message(props) {
    const margin = props.author === '' ? "-8px" : "0";

    return (
        <div className="message" style={{marginTop: margin}}>
            <div className="messageInfo">
                <div className="messageAuthor">{props.author}</div>
                <div className="messageTime">{props.time}</div>
            </div>
            <div className="messageText">{props.text}</div>
        </div>
    );
}

export default Message;