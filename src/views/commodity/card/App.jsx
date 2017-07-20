/**
 * @file App.jsx
 *
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card, Checkbox, Modal } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        ProdPurchases: state.toJS().commodity.getProdPurchaseById,
        queryProdPurchases: state.toJS().commodity.queryProdPurchase,
    }),
    dispatch => bindActionCreators({
    }, dispatch)
)
class Cardline extends Component {
    constructor(props) {
        super(props);
        this.handleOnchange = ::this.handleOnchange;
        this.confirmMain = ::this.confirmMain;
        this.confirmUsed = ::this.confirmUsed;
        this.handleCheckCancel = ::this.handleCheckCancel;

        this.state = {
            state: 0,
            checked: true,
        }
    }

    componentDidUpdate() {
    }

    /**
     * 主供应商和启、停用 复选框
     * @param {*} checkedValues 复选框选中项的值
     */
    handleOnchange(checkedValues) {
        // console.log('checked = ', checkedValues);
        // console.log(this.props.index)
        this.setState({ index: this.props.index });
        this.setState({ value: checkedValues });
        // checkedValues.map(value => {
        //     console.log(value);
        // });
    }

    /**
     * 修改主供应商时弹框
     */
    confirmMain() {
        Modal.confirm({
            title: '提示',
            content: '请确认变更当前供应商为主供应商',
            okText: '确认',
            cancelText: '取消',
            maskClosable: false,
            onCancel: this.handleCheckCancel,
            handleCheckOk: this.handleCheckOk
        });
    }

    /**
     * 修改启用时弹框
     */
    confirmUsed() {
        Modal.confirm({
            title: '提示',
            content: '是否失效商品供应商关系',
            okText: '确认',
            cancelText: '取消',
            maskClosable: false,
            onCancel: this.handleCheckCancel,
            handleCheckOk: this.handleCheckOk
        });
    }

    /**
     * 修改主供应商或者修改启用时的取消按钮回调
     */
    handleCheckCancel() {
    }

    /**
     * 修改主供应商或者修改启用时的确认按钮回调
     */
    handleCheckOk() {
        // const { selected } = this.state;
        // const { visibleData } = this.props;
        // if (selected === -1) {
        //     message.error('请选择审核结果');
        //     return;
        // }
        // this.props.form.validateFields((err) => {
        //     if (!err) {
        //         this.props.insertSupplierSettlementInfo({
        //             id: visibleData.id,
        //             status: parseInt(selected, 10),
        //             ...this.props.form.getFieldsValue()
        //         }).then(() => {
        //             this.props.getList()
        //         })
        //     }
        // })
    }

    render() {
        const { id, prefixCls, ProdPurchases } = this.props;
        const cardData = ProdPurchases.map(item => {
            return (
                <div
                    key={item.id}
                    className={`${prefixCls}-card-list`}
                >
                    <Card
                        style={{ width: 350 }}
                        className={
                                `${prefixCls}-card-${item.supplierType}-${item.status}`
                        }
                    >
                        <p
                            className={`${prefixCls}-close`}
                            style={{ float: 'right' }}
                        >
                            &times;
                                </p>
                        <p>
                            <span>供应商:</span>
                            <span>{item.spId}</span>
                            <b>-</b>
                            <span>{item.spName}</span>
                        </p>
                        <p>
                            <span>地点:</span>
                            <span>{item.spAdrId}</span>
                            <b>-</b>
                            <span>{item.spAdrName}</span>
                        </p>
                        <p>
                            <span>条码:</span>
                            <span>{item.internationalCode}</span>
                        </p>
                        <p>
                            <span>采购内装数:</span>
                            <span>{item.purchaseInsideNumber}</span>
                        </p>
                        <p>
                            <span>送货仓库:</span>
                            <span>{item.distributeWarehouseId}</span>
                        </p>
                        <p>
                            <span>采购价格 / 元:</span>
                            <span>{item.purchasePrice}</span>
                        </p>
                        <div className={`${prefixCls}-checkboxGroup tjf-css-fontColor`} >
                            {
                                this.props.ProdPurchases.id !== 0 ?
                                    <Checkbox
                                        checked={item.supplierType}
                                        onChange={this.confirmMain}
                                        defaultChecked={
                                            item.supplierType === 1
                                            ? this.state.checked : !this.state.checked
                                        }
                                    >主供应商
                                    </Checkbox>
                                    : ''
                            }
                            <Checkbox
                                checked={item.status}
                                onChange={this.confirmUsed}
                                defaultChecked={
                                    item.status === 1 ?
                                    this.state.checked : !this.state.checked
                                }
                            >启用</Checkbox>
                        </div>
                    </Card>
                </div>
            )
        });
        return (
            <div className={`${prefixCls}`}>
                <div>
                    <Form>
                        {cardData}
                    </Form>
                </div>
            </div>
        );
    }
}

Cardline.propTypes = {
    prefixCls: PropTypes.string,
    fecthGetProdPurchaseById: PropTypes.func,
    index: PropTypes.number,
    prodPurchase: PropTypes.objectOf(PropTypes.any),
    ProdPurchases: PropTypes.objectOf(PropTypes.any),
};

Cardline.defaultProps = {
    prefixCls: 'card-line',
};

export default Form.create()(Cardline);
