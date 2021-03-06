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
    render() {
        return (
            <Button {...this.props} />
        );
    }
}

Btn.propTypes = {
};

export default Btn;
