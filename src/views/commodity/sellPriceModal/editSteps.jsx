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
            prices: isEdit ? sellSectionPrices : []
        }
    }

    getEditableTableValues = () => {
        const { isEdit, newDatas = {}, startNumber, isSub } = this.props;
        const { sellPricesInReview = {}, auditStatus } = newDatas;
        const { sellSectionPrices = [] } = sellPricesInReview;
        const { prices } = this.state;
        return {
            MAXGOODS,
            isSub,
            isEdit,
            list: prices,
            sellSectionPrices,
            startNumber,
            isReadOnly: isSub,
            auditStatus
        };
    }

    handleNewestPriceChange = (num) => {
        const { isEdit } = this.props;
        const service = isEdit ? this.props.onEditChange : this.props.onCreateChange;
        service(num)
    }

    handlePricesChange = (prices, isContinue) => {
        const { isEdit } = this.props;
        const service = isEdit ? this.props.onEditPriceChange : this.props.onCreatPriceChange;
        service(prices, isContinue)
        this.setState({ prices });
    }

    handleCompanyChange = (record) => {
        this.props.onCreateComChange(record);
    }

    handleValueFormat = (text) => {
        return Number(text).toFixed(2);
    }

    render() {
        const { prefixCls, form, newDatas = {}, values = {}, isEdit, isSub } = this.props;
        const { sellPricesInReview = {} } = newDatas;
        const { getFieldDecorator } = form;
        return (
            <div className={`${prefixCls}-item item-max-height`}>
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
                            onChange={this.handlePricesChange}
                        />
                    </FormItem>
                </div>
                <Row>
                    <Col className="sell-prigce-edit-footer">
                        <FormItem label="建议零售价(元)：">
                            <span className={`${prefixCls}-day-input`}>
                                {getFieldDecorator('suggestPrice', {
                                    rules: [{ required: true, message: '请输入建议零售价(元)!' }],
                                    initialValue: sellPricesInReview.suggestPrice || values.suggestPrice
                                })(
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        disabled={isSub}
                                        formatter={this.handleValueFormat}
                                        parser={this.handleValueFormat}
                                        onChange={this.handleNewestPriceChange}
                                    />
                                    )}
                            </span>
                        </FormItem>
                        <FormItem label="商品采购价格：">
                            <span>{sellPricesInReview.purchasePrice || '-'}</span>
                        </FormItem>
                        {
                            isEdit ?
                                <FormItem label="子公司：">
                                    <span>{sellPricesInReview.branchCompanyId} - {sellPricesInReview.branchCompanyName}</span>
                                </FormItem> :
                                <FormItem label="子公司：">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' },
                                    })(<BranchCompany url="queryBranchCompanyInfo" onChange={this.handleCompanyChange} disabled={isSub} />)}
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
