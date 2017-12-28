import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Row, Col } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Util from '../../../util/util';
import {
    pubFetchValueList
} from '../../../actions/pub';
import EditableTable from './editableTable';
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
class FreightConditions extends Component {
    constructor(props) {
        super(props);
    }

    getEditableTableValues = (list) => {
        const { isEdit, newDatas = {}, startNumber } = this.props;
        const { auditStatus = 0 } = newDatas;
        // this.getFormData();
        return {
            isEdit,
            list,
            startNumber,
            data: newDatas.sellSectionPrices,
            readOnly: false,
            isSub: auditStatus === 1,
            // branchCompanyId: this.getFormData()
        };
    }

    getFormData = () => {
        const {
            branchCompanyId,
        } = this.props.form.getFieldsValue();
        return Util.removeInvalid({
            branchCompanyId: branchCompanyId.id
        });
    }

    returnChangeComP = () => {
        // this.props.onchange(this.getFormData());
    }

    handlePressEnter = (event) => {
        const value = +(event.target.value) || 0;
        // 回车操作时保存数量
        if (event.keyCode === 13) {
            this.handleChange(value);
        }
    }

    render() {
        const { prefixCls, form, newDatas = {} } = this.props;
        const { getFieldDecorator } = form;
        const { sellSectionPrices = [] } = newDatas;
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
                        {getFieldDecorator('sellSectionPrices', {
                            initialValue: this.getEditableTableValues(sellSectionPrices)
                        })(<EditableTable />)}
                    </FormItem>
                </div>
                <Row>
                    <Col>
                        <FormItem label="建议零售价(元)：">
                            <span>{newDatas.suggestPrice}</span>
                            <span className={`${prefixCls}-day-input`}>
                                {getFieldDecorator('newestPrice', {
                                    rules: [{ required: true, message: '请输入建议零售价(元)!' }],
                                    initialValue: newDatas.suggestPrice || 0
                                })(
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        formatter={text => Math.floor(text * 100) / 100}
                                        parser={text => Math.floor(text * 100) / 100}
                                        onKeyUp={this.handlePressEnter}
                                    />
                                    )}
                            </span>
                        </FormItem>
                        <FormItem label="商品采购价格：">
                            <span><i className={`new-price-state-${newDatas.state}`} />{newDatas.state || '-'}</span>
                        </FormItem>
                        <FormItem label="子公司:" className="edit-input">
                            {getFieldDecorator('branchCompanyId', {
                                initialValue: { id: '', name: '' }
                            })(<BranchCompany onChange={this.returnChangeComP} />)}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        )
    }
}

FreightConditions.propTypes = {
    prefixCls: PropTypes.string,
    form: PropTypes.objectOf(PropTypes.any),
    newDatas: PropTypes.objectOf(PropTypes.any),
    startNumber: PropTypes.number,
};

FreightConditions.defaultProps = {
    prefixCls: 'sell-modal',
    handleClose: () => { },
    datas: {},
    isEdit: false
}

export default Form.create()(FreightConditions);
