/**
 * @file App.jsx
 * @author shijh
 *
 * 按钮权限控制
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Common from './common';

@Common
class Right extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { children, props } = this.props;
        return React.cloneElement(
            children,
            {...props}
        )
    }
}

Right.propTypes = {
    children: PropTypes.node,
    props: PropTypes.objectOf(),
};

export default Right;
