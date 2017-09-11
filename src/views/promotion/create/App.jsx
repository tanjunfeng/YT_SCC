/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 促销管理 - 促销管理列表
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form, Icon, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList
}, dispatch))

class PromotionCreate extends PureComponent {
    constructor(props) {
        super(props);
        this.param = {
            pageNum: 1,
            total: 0
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>新增
            </div>
        );
    }
}

PromotionCreate.propTypes = {
}

export default withRouter(Form.create()(PromotionCreate));
