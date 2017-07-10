/**
 * @file Login.jsx
 * @author denglingbo
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';

class App extends Component {
    constructor(props) {
        super(props);
        // this.handleLogin = ::this.handleLogin;
    }

    componentWillMount() {}

    render() {
        return (
            <div>
                <input type="text" defaultValue="admin" />
                <input type="password" defaultValue="123456" />
                <button onClick={this.handleLogin}>Login!!</button>
            </div>
        )
    }
}

export default withRouter(App);
