/**
 * @file Login.jsx
 * @author denglingbo
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './login.scss';

import { loginAction } from '../../actions/user';
import Content from './content';
import Header from './header';
import Footer from './footer'

const FormItem = Form.Item;
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

App.propTypes = {
    location: PropTypes.objectOf(PropTypes.any)
}

export default App;
