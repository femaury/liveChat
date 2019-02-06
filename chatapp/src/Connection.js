import React, { Component } from 'react';

import './css/Connection.css';

const ROUTE = 'http://localhost:3000'

class Connection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true,
            username: '',
            password: '',
            passwordCheck: '',
            err_user: '',
            err_pass: '',
            err_passcheck: ''
        }

        this.submitLogin = (e) => {
            e.preventDefault();
            if (this.state.username.length < 4 || this.state.username.length > 25) {
                this.setState({ err_user: '4 to 25 characters' });
                return;
            } else if (!this.state.login && this.state.passwordCheck !== this.state.password) {
                this.setState({ err_passcheck: 'invalid'});
                return;
            } else {
                fetch(`${ROUTE}/connection`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        login: this.state.login,
                        username: this.state.username,
                        password: this.state.password
                    })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.error) {
                        this.setState(res.error);
                    } else if (res.success_login) {
                        this.props.socket.emit('userConnected', {
                            username: this.state.username
                        })
                        localStorage.setItem('token', res.token);
                    } else if (res.success_signup) {
                        this.setState({ login: true, username: '', password: '', passwordCheck: '' });
                    }
                })
            }
        }

        this.handleClick = (e) => {
            if (this.node !== null)
                if (!this.node.contains(e.target))
                    this.props.toggleModal();
        }

        this.toggleLogin = (login) => {
            this.setState({ login, username: '', password: '', passwordCheck: '' });
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    render() {
        const login = this.state.login;
        const err_user = this.state.err_user;
        const err_pass = this.state.err_pass;
        const err_passcheck = this.state.err_passcheck;
        return (
            <div className="wrapModal" onClick={(e) => this.handleClick(e)}>
                <div className="connModal" ref={node => this.node = node} style={{ height: login ? '400px' : '525px' }}>
                    <form className="loginForm" onSubmit={this.submitLogin}>
                        <div className="labelWrap"><label className="formLabel">Username</label>{err_user}</div>
                        <input
                            className="usernameInput"
                            value={this.state.username}
                            onChange={(e) => this.setState({ username: e.target.value }) } />
                        <div className="labelWrap"><label className="formLabel">Password</label>{err_pass}</div>
                        <input
                            className="passInput"
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value }) } />
                        {!login && 
                        <div className="labelWrap"><label className="formLabel">Verify Password</label>{err_passcheck}</div>}
                        {!login &&
                        <input
                            className="passCheckInput"
                            type="password"
                            value={this.state.passwordCheck}
                            onChange={(e) => this.setState({ passwordCheck: e.target.value })} />}
                        <button className="submitBtn" type="submit" onClick={this.submitLogin}>Submit</button>
                    </form>
                    <div className="connMenu">
                        <div
                            className="connMenuItem"
                            id="login"
                            style={{backgroundColor: login ? '#1F1F1F' : 'Black'}}
                            onClick={() => this.toggleLogin(true)}>Log In</div>
                        <div
                            className="connMenuItem"
                            id="signup"
                            style={{backgroundColor: !login ? '#1F1F1F' : 'Black'}}
                            onClick={() => this.toggleLogin(false)}>Sign Up</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Connection;