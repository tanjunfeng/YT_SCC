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
        this.state = {
            prices: []
        }
    }

    componentWillReceiveProps(nextProps) {
        const { newDatas, isEdit } = nextProps;
        console.log(newDatas);
    }

    getEditableTableValues = () => {
        const { isEdit, newDatas = {}, startNumber } = this.props;
        const { sellSectionPrices = [] } = newDatas;
        const { prices } = this.state;
        return {
            isEdit,
            list: prices,
            startNumber,
            readOnly: false
        };
    }

    handleNewestPriceChange = (num) => {
        const { isEdit } = this.props;
        const service = isEdit ? this.props.onEditChange : this.props.onCreateChange;
        service(num);
    }

    handlePricesChange = (prices, isContinue) => {
        this.setState({ prices });
    }

    handleCompanyChange = (record) => {
        console.log(record)
    }

    render() {
        const { prefixCls, form, newDatas = {}, values = {}, isEdit } = this.props;
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
                                    initialValue: values.suggestPrice || newDatas.suggestPrice
                                })(
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        formatter={text => Math.floor(text * 100) / 100}
                                        parser={text => Math.floor(text * 100) / 100}
                                        onChange={this.handleNewestPriceChange}
                                    />
                                    )}
                            </span>
                        </FormItem>
                        <FormItem label="商品采购价格：">
                            <span>{newDatas.purchasePrice || '-'}</span>
                        </FormItem>
                        {
                            isEdit ?
                                <FormItem label="子公司：">
                                    <span>{newDatas.branchCompanyId} - {newDatas.branchCompanyName}</span>
                                </FormItem> :
                                <FormItem label="子公司：">
                                    {getFieldDecorator('branchCompany', {
                                        initialValue: { id: '', name: '' }
                                    })(<BranchCompany onChange={this.handleCompanyChange} />)}
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
    startNumber: PropTypes.number,
    onEditChange: PropTypes.func
};

EditSteps.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(EditSteps);
