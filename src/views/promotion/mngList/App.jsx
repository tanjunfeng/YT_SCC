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
import { Link } from 'react-router-dom';
import {
    Table,
    Form,
    Icon,
    Menu,
    Dropdown,
    Modal,
    message,
    Button
} from 'antd';

import { fetchPoMngList, changePoMngSelectedRows, deletePoByIds } from '../../../actions';
import SearchForm from './searchForm';
import { PAGE_SIZE } from '../../../constant';
import { promotionMngList as columns } from '../columns';

@connect(state => ({
    poList: state.toJS().procurement.poList,
    selectedPoMngRows: state.toJS().procurement.selectedPoMngRows
}), dispatch => bindActionCreators({
    fetchPoMngList,
    changePoMngSelectedRows,
    deletePoByIds
}, dispatch))

class PromotionManagementList extends PureComponent {
    render() {
        return <SearchForm />;
    }
}

PromotionManagementList.propTypes = {
}

export default withRouter(Form.create()(PromotionManagementList));
