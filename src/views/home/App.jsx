/**
 * @file App.jsx
 * @author denglingbo
 *
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

@connect(
    state => ({
        user: state.toJS().user.data,
    })
)
class App extends Component {
    constructor(props) {
        super(props);

        this.handleHi = ::this.handleHi;
    }

    componentWillMount() {}

    componentDidMount() {}

    handleHi() {
        // Do
    }

    render() {
        return (
            <div>

                <button onClick={this.handleHi}>Hi!!</button>
            </div>
        )
    }
}

App.defaultProps = {
    user: {
        name: 'Who?'
    }
}

export default withRouter(App);
