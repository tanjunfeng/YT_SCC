/**
 * @file App.jsx
 * @author shijh
 *
 * 在售商品列表
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
} from '../../../actions/classifiedList';

@connect(
    state => ({
        user: state.toJS().user.data,
        rights: state.toJS().user.rights,
        data: state.toJS().commodity.classifiedList,
    }),
    dispatch => bindActionCreators({ }, dispatch)
)
class SalesMaintenance extends Component {

    render() {
        return (
            <div>
                123
            </div>
        )
    }
}

SalesMaintenance.propTypes = {
}

SalesMaintenance.defaultProps = {
}

export default withRouter(SalesMaintenance);
