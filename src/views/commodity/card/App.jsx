/**
 * @file App.jsx
 *
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card, Checkbox, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PAGE_SIZE } from '../../../constant';
import {
    fecthGetProdPurchaseById,
    fecthCheckMainSupplier,
    fetchUpdateProdPurchase,
    fetchQueryProdByCondition
} from '../../../actions';

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
    }),
    dispatch => bindActionCreators({
        fecthGetProdPurchaseById,
        fecthCheckMainSupplier,
        fetchUpdateProdPurchase,
        fetchQueryProdByCondition
    }, dispatch)
)
class Cardline extends Component {
    constructor(props) {
        super(props);
        this.handleOnchange = ::this.handleOnchange;
        this.confirmMain = ::this.confirmMain;
        this.confirmUsed = ::this.confirmUsed;
        this.handleCheckCancel = ::this.handleCheckCancel;
        this.handleDelete = ::this.handleDelete;
        this.handleCheckOk = ::this.handleCheckOk;
        this.handleChangeMain = ::this.handleChangeMain;

        this.state = {
            checked: true,
            id: this.props.index
        }
    }

    componentDidMount() {
        this.props.fetchQueryProdByCondition({
            productId: 'xpro12333',
            spId: 'YTXC1001',
            spAdrId: '1',
            branchCompanyId: 'cp1234',
            supplierType: 1,
            status: 1
        })
    }

     /**
     * 将刷新后的categorys值，push到数组中
     * @param {Object} nextProps 刷新后的属性
     */
    componentWillReceiveProps(nextProps) {
        const { getProdPurchaseByIds } = nextProps;
        if (getProdPurchaseByIds !== this.props.getProdPurchaseByIds) {
            this.getProdPurchaseByIds = getProdPurchaseByIds
        }
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
    confirmMain(bool) {
        if (bool) {
            Modal.confirm({
                title: '提示',
                content: '主供应商已经存在，请确认变更当前供应商',
                okText: '确认',
                cancelText: '取消',
                maskClosable: false,
                onCancel: this.handleCheckCancel,
                onOk: this.handleChangeMain
            });
        } else {
            Modal.confirm({
                title: '提示',
                content: '请确认变更当前供应商',
                okText: '确认',
                cancelText: '取消',
                maskClosable: false,
                onCancel: this.handleCheckCancel,
                onOk: this.handleChangeMain
            });
        }
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
            onOk: this.handleCheckUse
        });
    }

    /**
     * 修改主供应商或者修改启用时的取消按钮回调
     */
    handleCheckCancel() {
    }

    /**
     * 修改主供应商用时的确认按钮回调
     */
    handleCheckOk() {
        const { getProdPurchaseByIds } = this.props;
        this.props.fecthCheckMainSupplier({
            productId: getProdPurchaseByIds.productId,
            supplierType: 1
        })
        .then((res) => {
            this.confirmMain(res.success)
        }).catch((res) => {
            this.confirmMain(res.success)
        })
    }

    /**
     * 改变主供应商状态
     */
    handleChangeMain() {
        const { id, spId, spAdrId, productId, branchCompanyId, supplierType,
            purchaseInsideNumber, purchasePrice, internationalCode, distributeWarehouseId
        } = this.props.getProdPurchaseByIds;
        const data = {
            id,
            spId,
            spAdrId,
            productId,
            branchCompanyId,
            supplierType,
            purchaseInsideNumber,
            purchasePrice,
            internationalCode,
            distributeWarehouseId
        }
        this.props.fetchUpdateProdPurchase(data);
        this.handlePaginationChange();
    }

    /**
     * 修改启用时的确认按钮回调
     */
    handleCheckUse() {
    }

    handleDelete() {
        Modal.confirm({
            title: 'Do you want to delete these items?',
            content: 'When clicked the OK button, this dialog will be closed after 1 second',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    render() {
        const { prefixCls, getProdPurchaseByIds } = this.props;
        // console.log(getProdPurchaseByIds)
        const cardData =
            <div
                key={getProdPurchaseByIds.id}
                className={`${prefixCls}-card-list`}
            >
                <Card
                    style={{ width: 350 }}
                    className={
                        `${prefixCls}-card-${getProdPurchaseByIds.supplierType}-${getProdPurchaseByIds.status}
                            ${prefixCls}-supplierType-img`
                    }
                >
                    {
                        getProdPurchaseByIds.supplierType === 1 &&
                        <p className={`${prefixCls}-supplierType-img`}><span>主</span></p>
                    }
                    <a
                        className={`${prefixCls}-close`}
                        style={{ float: 'right' }}
                        onClick={this.handleDelete}
                    >
                        &times;
                        </a>
                    <p>
                        <span>供应商 : </span>
                        <span>{getProdPurchaseByIds.spId}</span>
                        <b>-</b>
                        <span>{getProdPurchaseByIds.spName}</span>
                    </p>
                    <p>
                        <span>地点 : </span>
                        <span>{getProdPurchaseByIds.spAdrId}</span>
                        <b>-</b>
                        <span>{getProdPurchaseByIds.spAdrName}</span>
                    </p>
                    <p>
                        <span>条码 : </span>
                        <span>{getProdPurchaseByIds.internationalCode}</span>
                    </p>
                    <p>
                        <span>采购内装数 : </span>
                        <span>{getProdPurchaseByIds.purchaseInsideNumber}</span>
                    </p>
                    <p>
                        <span>送货仓库 : </span>
                        <span>{getProdPurchaseByIds.distributeWarehouseId}</span>
                    </p>
                    <p>
                        <span>采购价格 / 元 : </span>
                        <span>{getProdPurchaseByIds.purchasePrice}</span>
                    </p>
                    <div className={`${prefixCls}-checkboxGroup`} >
                        <Checkbox
                            checked={getProdPurchaseByIds.supplierType}
                            onChange={this.handleCheckOk}
                            defaultChecked={
                                getProdPurchaseByIds.supplierType === 1
                                    ? this.state.checked : !this.state.checked
                            }
                        >主供应商
                        </Checkbox>
                        <Checkbox
                            checked={getProdPurchaseByIds.status}
                            onChange={this.handleCheckUse}
                            defaultChecked={
                                getProdPurchaseByIds.status === 1 ?
                                    this.state.checked : !this.state.checked
                            }
                        >启用</Checkbox>
                    </div>
                </Card>
            </div>
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
    getProdPurchaseByIds: PropTypes.objectOf(PropTypes.any),
    fecthCheckMainSupplier: PropTypes.func,
    fetchUpdateProdPurchase: PropTypes.func,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    fetchQueryProdByCondition: PropTypes.objectOf(PropTypes.any),
};

Cardline.defaultProps = {
    prefixCls: 'card-line',
};

export default Form.create()(Cardline);
