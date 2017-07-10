import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Form, InputNumber, Select } from 'antd';

import { QueryAllSupplier, purchasePriceVisible, addPurchasementDetail, getPurchase, updatePurchase } from '../../../actions/producthome';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(
    state => ({
        toPurchasePriceVisible: state.toJS().commodity.toPurchasePriceVisible,
        isEdit: state.toJS().commodity.isEdit,
        visibleData: state.toJS().commodity.visibleData,
        queryAll: state.toJS().commodity.queryAll,
        id: state.toJS().commodity.id,
        getPurchasePrice: state.toJS().commodity.getPurchasePrice,
        supplierId: state.toJS().commodity.supplierId,
        companyName: state.toJS().commodity.companyName,
        pricingId: state.toJS().commodity.pricingId
    }),
    dispatch => bindActionCreators({
        QueryAllSupplier,
        purchasePriceVisible,
        addPurchasementDetail,
        getPurchase,
        updatePurchase
    }, dispatch)
)
class Purchasing extends PureComponent {
    constructor(props) {
        super(props);
        this.handleAuditCancel = ::this.handleAuditCancel;
        this.handleOk = ::this.handleOk;
        this.handleChange = ::this.handleChange;
        this.state = {
            supplierValue: ''
        }
    }
    componentDidMount() {
        const id = this.props.id;
        this.props.isEdit ? this.props.getPurchase({ id: id }) && this.props.QueryAllSupplier() : this.props.QueryAllSupplier();
    }

    handleAuditCancel() {
        this.props.purchasePriceVisible({ isVisible: false });
    }

    handleChange(value) {
        this.setState({
            supplierValue: value
        })
    }


    handleOk(e) {
        e.preventDefault();
        const { id } = this.props.match.params;
        this.props.form.validateFields((err) => {
            if (!err) {
                const supplierId = this.state.supplierValue;
                const oldPriceId = this.props.pricingId;
                const result = this.props.form.getFieldsValue();
                const goodsPriceInfo = {
                    ...result
                }
                this.props.isEdit ?
                    this.props.updatePurchase({
                        supplierId: supplierId,
                        productId: id,
                        oldPriceId: oldPriceId,
                        goodsPriceInfo
                    }).then(() => {
                        this.props.fetchList();
                        this.props.purchasePriceVisible({ isVisible: false });
                    }) :
                    this.props.addPurchasementDetail({
                        supplierId,
                        productId: id,
                        goodsPriceInfo
                    }).then(() => {
                        this.props.fetchList();
                        this.props.purchasePriceVisible({ isVisible: false });
                    })
            }
        })
    }


    render() {
        const { queryAll = [] } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { visibleData, toPurchasePriceVisible } = this.props;
        const isEdit = this.props.isEdit;
        const { getPurchasePrice } = isEdit ? this.props : [];
        const { companyName } = this.props;
        return (
            <Modal
                visible={this.props.toPurchasePriceVisible}
                onCancel={this.handleAuditCancel}
                onOk={this.handleOk}
                title={isEdit ? '修改采购价格' : '新增采购价格'}
                width="900px"
            >
                <div className="price-model">
                    <Form>
                        <div className="price-tittle">
                            <div>添加阶梯价格</div>
                            <div><span className="price-piece">数量区间/件</span><span className="price-num">售价/元</span></div>
                        </div>
                        <div className="price-form">
                            <FormItem>
                                {getFieldDecorator('startNumber1', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.startNumber1
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <span className="price-line">——</span>
                            <FormItem>
                                {getFieldDecorator('endNumber1', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.endNumber1
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('price1', {
                                    rules: [{
                                        required: true,
                                        message: '请输入价格'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.price1
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                        </div>
                        <div className="price-form">
                            <FormItem>
                                {getFieldDecorator('startNumber2', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.startNumber2
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <span className="price-line">——</span>
                            <FormItem>
                                {getFieldDecorator('endNumber2', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.endNumber2
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('price2', {
                                    rules: [{
                                        required: true,
                                        message: '请输入价格'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.price2
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                        </div>
                        <div className="price-form">
                            <FormItem>
                                {getFieldDecorator('startNumber3', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.startNumber3
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <span className="price-line">——</span>
                            <FormItem>
                                {getFieldDecorator('endNumber3', {
                                    rules: [{
                                        required: true,
                                        message: '请输入数量'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.endNumber3
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('price3', {
                                    rules: [{
                                        required: true,
                                        message: '请输入价格'
                                    }],
                                    initialValue: getPurchasePrice === undefined ? '' : getPurchasePrice.price3
                                })(
                                    <InputNumber min={0} />
                                    )}
                            </FormItem>
                        </div>
                        <div>选择供应商</div>
                        <div>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                optionFilterProp="children"
                                value={isEdit ? companyName : '请输入供应商'}
                                onChange={this.handleChange}
                                filterOption={
                                    (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {queryAll.map(item => (
                                    <Option value={item.supplierId}>{item.companyName}</Option>
                                ))
                                }
                            </Select>
                        </div>
                    </Form>
                </div>
            </Modal>
        );
    }
}

Purchasing.propTypes = {
    visibleData: PropTypes.objectOf(PropTypes.any),
    form: PropTypes.objectOf(PropTypes.any),
}

export default withRouter(Form.create()(Purchasing));
