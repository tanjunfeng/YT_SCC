/**
 * @file App.jsx
 *
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Card, Checkbox, Modal, message, Pagination } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PAGE_SIZE } from '../../../constant';
import {
    fetchGetProdPurchaseById,
    fecthCheckMainSupplier,
    fetchUpdateProdPurchase,
    fetchQueryProdByCondition,
    fetchChangeProPurchaseStatus,
    fetchDeleteProdPurchaseById,
    fetchGetProductById,
    fecthGetProdPurchaseById
} from '../../../actions';
import {
    GetProductById,
    GetProdPurchaseById
} from '../../../actions/producthome';

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseByIds,
    }),
    dispatch => bindActionCreators({
        fetchGetProdPurchaseById,
        fecthCheckMainSupplier,
        fetchUpdateProdPurchase,
        fetchQueryProdByCondition,
        fetchChangeProPurchaseStatus,
        fetchDeleteProdPurchaseById,
        fetchGetProductById,
        fecthGetProdPurchaseById,
        GetProductById,
        GetProdPurchaseById
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
        // this.props.GetProdPurchaseById({
        //     id: this.props.id
        // });
    }

     /**
     * 将刷新后的getProdPurchaseByIds值赋值给getProdPurchaseByIds
     *
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
    confirmUsed(item) {
        Modal.confirm({
            title: '提示',
            content: '是否失效商品供应商关系',
            okText: '确认',
            cancelText: '取消',
            maskClosable: false,
            onCancel: this.handleCheckCancel,
            onOk: () => {
                this.props.fetchChangeProPurchaseStatus({
                    id: item.id,
                    productId: item.productId,
                    status: item.status === 0 ? 1 : 0
                })
                .then(() => {
                    message.success('修改状态成功');
                    this.props.goto();
                }).catch(() => {
                    message.error('修改状态失败')
                })
            }
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
    handleCheckOk(item) {
        Modal.confirm({
            title: '提示',
            content: '是否切换主供应商',
            okText: '确认',
            cancelText: '取消',
            maskClosable: false,
            onCancel: this.handleCheckCancel,
            onOk: () => {
                this.props.fecthCheckMainSupplier({
                    productId: item.productId,
                    supplierType: 1
                })
                .then((res) => {
                    message.success('修改状态成功');
                    this.props.goto();
                }).catch((res) => {
                    message.error('修改状态失败')
                })
            }
        });
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
        // this.handlePaginationChange();
    }

    handleDelete(e) {
        e.stopPropagation();
        const { proId } = this.props;
        const id = e.target.getAttribute('data-id');
        Modal.confirm({
            title: '删除',
            content: '是否删除当前关系列表?',
            onOk: () => {
                this.props.fetchDeleteProdPurchaseById({
                    productId: proId,
                    id,
                })
                .then((res) =>
                    message.success('删除成功'),
                    this.props.goto()
                );
            },
            onCancel() { },
        });
    }

    handlePaginationChange = (go) => {
        this.props.goto(go)
    }

    handleAddPrice = (item) => {

    }

    renderCard = (datas) => {
        const {
            prefixCls,
        } = this.props;
        return (
            datas.map((item) => {
                return (
                    <div
                        key={item.id}
                        className={`${prefixCls}-card-list`}
                    >
                        <Card
                            style={{ width: 350 }}
                            className={
                                `${prefixCls}-card-${item.supplierType}-${item.status}
                            ${prefixCls}-supplierType-img`
                            }
                            onClick={() => this.handleAddPrice(item)}
                        >
                            {
                                item.supplierType === 1 &&
                                <p className={`${prefixCls}-supplierType-img`}><span>主</span></p>
                            }
                            <a
                                data-id={item.id}
                                className={`${prefixCls}-close`}
                                style={{ float: 'right' }}
                                onClick={this.handleDelete}
                            >
                                &times;
                        </a>
                            <p>
                                <span>供应商 : </span>
                                <span>{item.spId}</span>
                                <b>-</b>
                                <span>{item.spName}</span>
                            </p>
                            <p>
                                <span>地点 : </span>
                                <span>{item.spAdrId}</span>
                                <b>-</b>
                                <span>{item.spAdrName}</span>
                            </p>
                            <p>
                                <span>条码 : </span>
                                <span>{item.internationalCode}</span>
                            </p>
                            <p>
                                <span>采购内装数 : </span>
                                <span>{item.purchaseInsideNumber}</span>
                            </p>
                            <p>
                                <span>送货仓库 : </span>
                                <span>{item.distributeWarehouseId}</span>
                            </p>
                            <p>
                                <span>采购价格 / 元 : </span>
                                <span>{item.purchasePrice}</span>
                            </p>
                            <div className={`${prefixCls}-checkboxGroup`} >
                                <Checkbox
                                    checked={!!item.supplierType}
                                    onChange={() => this.handleCheckOk(item)}
                                >
                                    主供应商
                                </Checkbox>
                                <Checkbox
                                    checked={!!item.status}
                                    onChange={() => this.confirmUsed(item)}
                                >
                                    启用
                                </Checkbox>
                            </div>
                        </Card>
                    </div>
                )
            })
        )
    }

    render() {
        const {
            prefixCls,
            initData = {}
        } = this.props;
        return (
            <div className={`${prefixCls}`}>
                <div>
                    {
                        initData.data && initData.data.length > 0 &&
                        <Form>
                            {
                                this.renderCard(initData.data)
                            }
                            <Pagination
                                current={initData.pageNum}
                                pageSize={PAGE_SIZE}
                                onChange={this.handlePaginationChange}
                                total={initData.total}
                            />
                        </Form>
                    }
                </div>
            </div>
        );
    }
}

Cardline.propTypes = {
    getProdPurchaseByIds: PropTypes.objectOf(PropTypes.any),
    fecthCheckMainSupplier: PropTypes.func,
    fetchDeleteProdPurchaseById: PropTypes.func,
    fetchUpdateProdPurchase: PropTypes.func,
    fetchChangeProPurchaseStatus: PropTypes.func,
    prefixCls: PropTypes.string,
    id: PropTypes.string,
    index: PropTypes.number,
    initData: PropTypes.objectOf(PropTypes.any),
    GetProdPurchaseById: PropTypes.func,
    goto: PropTypes.func,
    proId: PropTypes.string,
};

Cardline.defaultProps = {
    prefixCls: 'card-line',
    goto: () => {},
};

export default Form.create()(Cardline);
