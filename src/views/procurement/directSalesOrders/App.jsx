/**
 * @file App.jsx
 * @author taoqiyu
 *
 * 采购管理 - 直营店下单
 */
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Table, Form } from 'antd';

import { goodsColumns as columns } from '../columns';
import StoresForm from './storesForm';
import GoodsForm from './goodsForm';

class DirectSalesOrders extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            goodsFormConditions: {
                branchCompanyId: '',
                deliveryWarehouseCode: ''
            },
            goodsInfo: {},
            goodsList: []
        }
    }

    handleStoresChange = (record) => {
        this.setState({
            goodsFormConditions: {
                branchCompanyId: record.branchCompanyId,
                deliveryWarehouseCode: record.deliveryWarehouseCode
            }
        });
    }

    handleGoodsFormChange = (goodsInfo) => {
        this.setState({ goodsInfo });
    }

    render() {
        return (
            <div>
                <StoresForm
                    onChange={this.handleStoresChange}
                />
                <GoodsForm
                    value={this.state.goodsFormConditions}
                    onChange={this.handleGoodsFormChange}
                />
                <Table
                    dataSource={this.state.goodsList}
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

export default withRouter(Form.create()(DirectSalesOrders));
