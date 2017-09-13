/**
 * @file Login.jsx
 * @author denglingbo
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './login.scss';

import { loginAction } from '../../actions/user';
import Content from './content';
import Header from './header';
import Footer from './footer';

@connect(
    state => ({
        user: state.toJS().user.data,
    }),
    dispatch => bindActionCreators({ loginAction }, dispatch)
)
class App extends Component {
    render() {
        return (
            <div className="yt-wrap">
                <div className="yt-head-wrap">
                    <div className="yt-wrap-inner">
                        <Header />
                    </div>
                </div>
                <div className="yt-content-wrap">
                    <div className="yt-wrap-inner">
                        <Content />
                    </div>
                </div>
                <div className="yt-foot-wrap">
                    <div className="yt-wrap-inner">
                        <Footer />
                    </div>
                </div>
            </div>

        )
    }
}

export default App;
