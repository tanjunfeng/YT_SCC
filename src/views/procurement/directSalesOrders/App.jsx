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
import { DirectStores } from '../../../container/search';

import {
    getPromotionList,
    clearPromotionList,
    updatePromotionStatus
} from '../../../actions/promotion';
import { managementList as columns } from '../columns';

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
        this.param = {};
        this.state = {
            storeId: ''
        }
        this.handleDirectStoresClear = this.handleDirectStoresClear.bind(this);
        this.handleDirectStoresChoose = this.handleDirectStoresChoose.bind(this);
    }

    componentWillMount() {
        this.props.clearPromotionList();
    }

    componentWillUnmount() {
        this.props.clearPromotionList();
    }

    handleDirectStoresChoose(storeId) {
        this.setState({ storeId });
    }

    handleDirectStoresClear() {
        this.setState({ storeId: '' });
    }

    render() {
        const { data } = this.props.promotionList;
        return (
            <div>
                <DirectStores
                    onDirectStoresClear={this.handleDirectStoresClear}
                    onDirectStoresChoose={this.handleDirectStoresChoose}
                />
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
