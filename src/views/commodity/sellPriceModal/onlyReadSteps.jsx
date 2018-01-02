import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, message, Select } from 'antd';
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
        super(props);
        this.childCompany = props.datas.branchCompanyId ? {
            branchCompanyId: props.datas.branchCompanyId,
            branchCompanyName: props.datas.branchCompanyName
        } : {};
    }

    getEditableTableValues = (list) => {
        const { isEdit, newDatas, startNumber } = this.props;
        const { auditStatus = 0 } = newDatas;
        return {
            isEdit,
            list,
            startNumber,
            data: newDatas.sellSectionPrices,
            readOnly: false,
            isSub: auditStatus === 1
        };
    }

    render() {
        const { prefixCls, form, newDatas } = this.props;
        const { getFieldDecorator } = form;
        const { sellSectionPrices = [] } = newDatas;
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
                        {getFieldDecorator('sellSectionPrices', {
                            initialValue: this.getEditableTableValues(sellSectionPrices)
                        })(
                            <PriceTable />)}
                    </FormItem>
                </div>
                <div className="read-only-footer">
                    <span>*建议零售价(元):</span>
                    <span className={
                        newDatas.sellPricesInReview.suggestPrice !== newDatas.suggestPrice ?
                            'sell-modal-border' : null}
                    >{newDatas.sellPricesInReview.suggestPrice}</span>
                    <span>商品采购价格：</span>
                    <span className={
                        newDatas.sellPricesInReview.suggestPrice !== newDatas.suggestPrice ?
                            'sell-modal-border' : null}
                    >{newDatas.sellPricesInReview.state || '-'}</span>
                    <span className="edit-input">子公司:</span>
                    <span className={
                        newDatas.sellPricesInReview.branchCompanyId !== newDatas.branchCompanyId ?
                            'sell-modal-border' : null}
                    >{newDatas.sellPricesInReview.branchCompanyId} - {newDatas.sellPricesInReview.branchCompanyName}</span>
                </div>
            </div>
        )
    }
}

OnlyReadSteps.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    datas: PropTypes.objectOf(PropTypes.any),
};

OnlyReadSteps.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(OnlyReadSteps);
