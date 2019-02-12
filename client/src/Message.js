import React from 'react';
import './css/Message.css';

function markdownText(text) {
	const words = text.split(/\s/);
	text = words.map((word, i) => {
		const separator = (i < words.length - 1) ? ' ' : '';
		const markdownImage = word.match(/^!\[([a-zA-Z0-9 ]*)\]\((https?:\/\/[^)]*)\)$/);

		if (word.match(/^https?:\//)) {
			return (<span><a href={word}>{word}</a>{separator}</span>);
		} else if (markdownImage) {
			return (<span><img src={markdownImage[2]} alt={markdownImage[1]} style={{ height: "12vh" }} />{separator}</span>);
		}
		return word + separator;
	});
	return text;
}

function Message(props) {
	const { author, time, text } = props;
	const margin = author === '' ? "-8px" : "0";

	return (
		<div className="message" style={{ marginTop: margin }}>
			<div className="messageInfo">
				<div className="messageAuthor">{author}</div>
				<div className="messageTime">{time}</div>
			</div>
			<div className="messageText">{markdownText(text)}</div>
		</div>
	);
}

export default Message;
