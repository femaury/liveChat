# Live Chat

Current build live at [soir.wtf](https://soir.wtf/chat)!

<img src="https://github.com/femaury/liveChat/blob/master/screenshot.png?raw=true"
     title="Live Chat by Felix Maury" width="750">

Built with [ReactJS](https://reactjs.org/) and [NodeJS](https://nodejs.org/en/)

## Installing

You will need NodeJS installed to use npm. Then run the following commands from project root.
```
> npm install
> npm start
```
That's it! Server is up and running on localhost:3000 by default. <br /> <br />
To make changes, you'll need to also run `npm install` in the `client` directory,
 and once you've finished with the changes, run `npm run build`.


## Features

#### Live chat with socket.io
<ul>
<li>Messages from same user are grouped by intervals of 4 minutes.</li>
<li>Timestamps follow the following format: <br />
    <b>HH:MM</b> (today), <b>Yesterday HH:MM</b>, <b>Last Day of the week HH:MM</b> (Until 7 earlier) then <b>DD/MM/YY HH:MM</b></li>
<li>User(s) is/are typing...</li>
<li>User has joined/left the chat.</li>
<li>Live list of connected usernames on the right side of the chat</li>
<li>Infinite scroll loads messages as you scroll up</li>
<li>Auto scroll down on new messages when scroll is already at bottom</li>
<li>Bots can connect on socket and send/receive messages easily</li>
</ul>

#### Text parsing for images and links

To send an image: `![alt](https://image_link.png)`

#### Authenticaton with JSONWebTokens

#### Format adapted to mobile browsers [WIP]
