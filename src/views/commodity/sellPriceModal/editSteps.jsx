import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Util from '../../../util/util';
import {
    pubFetchValueList
} from '../../../actions/pub';
import PriceTable from './priceTable';
import { productAddPriceVisible } from '../../../actions/producthome';
import { fetchAddProdPurchase } from '../../../actions';
import { MAXGOODS } from '../../../constant'
import { BranchCompany } from '../../../container/search';

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

class EditSteps extends Component {
    constructor(props) {
        super(props);

        const { isEdit = false, newDatas = {} } = props;
        const { sellPricesInReview = {} } = newDatas;
        const { sellSectionPrices = [] } = sellPricesInReview;

        this.state = {
            prices: isEdit ? sellSectionPrices : [],
            markList: []
        }
    }

    getEditableTableValues = () => {
        const { isEdit, newDatas = {}, startNumber, isSub } = this.props;
        const { sellPricesInReview = {}, sellSectionPrices = {}, auditStatus } = newDatas;
        const { prices } = this.state;
        return {
            MAXGOODS,
            isSub,
            isEdit,
            list: prices,
            currentPrices: sellSectionPrices,
            startNumber,
            isReadOnly: isSub,
            auditStatus,
            markList: this.state.markList,
            grossProfit: sellPricesInReview.purchasePrice || null
        };
    }

    handleNewestPriceChange = (num) => {
        const { isEdit, onEditChange, onCreateChange } = this.props;
        const service = isEdit ? onEditChange : onCreateChange;
        service(num);
    }

    handlePricesChange = (prices, isContinue) => {
        const { isEdit } = this.props;
        const service = isEdit ? this.props.onEditPriceChange : this.props.onCreatPriceChange;
        service(prices, isContinue)
        this.setState({ prices });
    }

    handleMarkable = (markList) => {
        this.setState({ markList });
    }

    handleCompanyChange = (record) => {
        this.props.onCreateComChange(record);
    }

    handleValueFormat = (text) => Number(text).toFixed(2)

    render() {
        const { prefixCls, form, newDatas = {}, values = {}, isEdit, isSub } = this.props;
        const { sellPricesInReview = {} } = newDatas;
        const { getFieldDecorator } = form;
        const hasMarginLeft = isEdit ? 'sell-modal-edit-company' : '';
        return (
            <div className={`${prefixCls}-item item-max-height`}>
                <div className={`${prefixCls}-item-title`}>
                    添加阶梯价格
                    <span className={`${prefixCls}-item-tip`}>
                        &nbsp;(请按从小到大的顺序，最大值为{MAXGOODS})
                    </span>
                </div>
                <div className={`${prefixCls}-item-content`}>
                    <FormItem className="diff-price-table">
                        <PriceTable
                            value={this.getEditableTableValues()}
                            onChange={this.handlePricesChange}
                            onMarkable={this.handleMarkable}
                        />
                    </FormItem>
                </div>
                <Row>
                    <Col className="sell-prigce-edit-footer">
                        <FormItem label="建议零售价(元)：">
                            <span className={`${prefixCls}-day-input`}>
                                {getFieldDecorator('suggestPrice', {
                                    rules: [
                                        {
                                            required: true, message: '建议零售价不能为空'
                                        },
                                        {
                                            validator: Util.limitPositive,
                                            message: '建议零售价不能为零或负数'
                                        },
                                        {
                                            validator: Util.limitTwoDecimalPlaces,
                                            message: '建议零售价必须是两位以内小数'
                                        }],
                                    initialValue: sellPricesInReview.suggestPrice
                                        || values.suggestPrice
                                })(<InputNumber
                                    step={0.01}
                                    className={sellPricesInReview.suggestPrice
                                        !== newDatas.suggestPrice
                                        ? 'sell-modal-border' : null}
                                    disabled={isSub}
                                    onChange={this.handleNewestPriceChange}
                                />)}
                            </span>
                        </FormItem>
                        <FormItem label="商品采购价格：">
                            <span className={
                                sellPricesInReview.purchasePrice
                                    !== newDatas.purchasePrice
                                    ? 'sell-modal-border' : null}
                            >
                                {sellPricesInReview.purchasePrice || '-'}
                            </span>
                        </FormItem>
                        {
                            isEdit ?
                                <FormItem className={hasMarginLeft} label="子公司：">
                                    <span className={
                                        sellPricesInReview.branchCompanyId
                                            !== newDatas.branchCompanyId
                                            ? 'sell-modal-border' : null}
                                    >
                                        {sellPricesInReview.branchCompanyId} - {
                                            sellPricesInReview.branchCompanyName}
                                    </span>
                                </FormItem> :
                                <FormItem label="子公司：">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' },
                                    })(<BranchCompany
                                        url="queryBranchCompanyInfo"
                                        onChange={this.handleCompanyChange}
                                        values={values}
                                        disabled={isSub}
                                    />)}
                                </FormItem>

                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

EditSteps.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    newDatas: PropTypes.objectOf(PropTypes.any),
    values: PropTypes.objectOf(PropTypes.any),
    startNumber: PropTypes.number,
    isEdit: PropTypes.bool,
    isSub: PropTypes.bool,
    onEditChange: PropTypes.func,
    onCreatPriceChange: PropTypes.func,
    onEditPriceChange: PropTypes.func,
    onCreateComChange: PropTypes.func,
    onCreateChange: PropTypes.func
};

EditSteps.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(EditSteps);
