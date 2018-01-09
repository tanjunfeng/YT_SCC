import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, message, Select, Table } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    pubFetchValueList
} from '../../../actions/pub';
import PriceTable from './priceTable';
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import { MAXGOODS } from '../../../constant'

const FormItem = Form.Item;

@connect(
    state => ({
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
        getProductById: state.toJS().commodity.getProductById
    }),
    dispatch => bindActionCreators({
        productAddPriceVisible,
        fetchAddProdPurchase,
        pubFetchValueList,
    }, dispatch)
)
class OnlyReadSteps extends Component {
    constructor(props) {
        super(props)

        this.columns = [{
            title: '起始数量',
            dataIndex: 'startNumber',
            key: 'startNumber',
        }, {
            title: '终止数量',
            dataIndex: 'endNumber',
            key: 'endNumber',
        }, {
            title: '最新售价/元',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '商品毛利率',
            dataIndex: 'percentage',
            key: 'percentage',
        }];
    }

    getEditableTableValues = () => {
        const { isEdit, newDatas = {}, startNumber, isReadOnly } = this.props;
        const { sellPricesInReview, sellSectionPrices = [] } = newDatas;
        const { auditStatus = 0 } = newDatas;
        return {
            isEdit,
            list: sellSectionPrices,
            startNumber,
            data: newDatas.sellSectionPrices,
            isReadOnly,
            isSub: auditStatus === 1,
            shouldMark: false,
            grossProfit: sellPricesInReview.purchasePrice || null
        };
    }

    render() {
        const { prefixCls, newDatas = {} } = this.props;
        return (
            <div className={`${prefixCls}-item`}>
                <div className={`${prefixCls}-item-title`}>
                    添加阶梯价格
                    <span className={`${prefixCls}-item-tip`}>
                        &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                    </span>
                </div>
                <div className={`${prefixCls}-item-content`}>
                    <FormItem>
                        <PriceTable
                            value={this.getEditableTableValues()}
                            onChange={() => {}}
                        />
                    </FormItem>
                </div>
                <div className="read-only-footer">
                    <span>*建议零售价(元):</span>
                    <span>{newDatas.suggestPrice}</span>
                    <span>商品采购价格：</span>
                    <span>{newDatas.purchasePrice || '-'}</span>
                    <span className="edit-input">子公司:</span>
                    <span>{newDatas.branchCompanyId} - {newDatas.branchCompanyName}</span>
                </div>
            </div>
        )
    }
}

OnlyReadSteps.propTypes = {
    prefixCls: PropTypes.string
};

OnlyReadSteps.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(OnlyReadSteps);
