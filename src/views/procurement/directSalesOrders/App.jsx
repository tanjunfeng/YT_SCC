/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Table, Form } from 'antd';

import {
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
} from '../../../actions/promotion';
import { poMngListColumns as columns } from '../columns';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';

@connect(state => ({
    promotionList: state.toJS().promotion.list
}), dispatch => bindActionCreators({
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
}, dispatch))

class DirectSalesOrders extends PureComponent {
    constructor(props) {
        super(props);
        this.handleStoresChange = this.handleStoresChange.bind(this);
        this.state = {
            branchCompanyId: ''
        }
    }

    componentWillMount() {
        this.props.clearPromotionList();
    }

    componentWillUnmount() {
        this.props.clearPromotionList();
    }

    handleStoresChange = (branchCompanyId) => {
        this.setState({ branchCompanyId });
    }

    render() {
        const { data } = this.props.promotionList;
        return (
            <div>
                <StoresForm
                    value={this.branchCompanyId}
                    onChange={this.handleStoresChange}
                />
                <GoodsForm />
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    scroll={{
                        x: 1400
                    }}
                />
            </div>
        );
    }
}

DirectSalesOrders.propTypes = {
    clearPromotionList: PropTypes.func,
    promotionList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
}

export default withRouter(Form.create()(DirectSalesOrders));
