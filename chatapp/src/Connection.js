import React, { Component } from 'react';

import './css/Connection.css';

class Connection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true,
            username: '',
            password: '',
            passwordCheck: ''
        }
        
        this.submitLogin = () => {

        }

        this.handleClick = (e) => {
            if (this.node !== null)
                if (!this.node.contains(e.target))
                    this.props.toggleModal();
        }

        this.toggleLogin = (login) => {
            this.setState({ login });
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
        return (
            <div className="wrapModal" onClick={(e) => this.handleClick(e)}>
                <div className="connModal" ref={node => this.node = node}>
                    <form className="loginForm" onSubmit={this.submitLogin}>
                        <label className="formLabel">Username</label>
                        <input
                            className="usernameInput"
                            value={this.state.username}
                            onChange={(e) => { this.setState({ username: e.target.value }) }} />
                        <label className="formLabel">Password</label>
                        <input
                            className="passInput"
                            type="password"
                            value={this.state.password}
                            onChange={(e) => { this.setState({ password: e.target.value }) }} />
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