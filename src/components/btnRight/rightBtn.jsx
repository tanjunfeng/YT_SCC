/**
 * @file App.jsx
 * @author shijh
 *
 * 按钮权限控制
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Common from './common';

@Common
class Btn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Button {...this.props} />
        );
    }
}

Btn.propTypes = {
    children: PropTypes.node
};

export default Btn;