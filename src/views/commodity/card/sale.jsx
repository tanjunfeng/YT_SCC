/**
 * @file App.jsx
 *
 * @author shijinhua,caoyanxuan
 *
 * 公共searchForm
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Form, Card, Checkbox, Modal,
    message, Pagination,
} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PAGE_SIZE, MAXGOODS } from '../../../constant';
import {
    fetchUpdateProdPurchase,
    fetchChangeProPurchaseStatus,
    fetchDeleteProdPurchaseById,
} from '../../../actions';

@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        queryProdPurchaseExtByCondition: state.toJS().commodity.queryProdPurchaseExtByCondition,
    }),
    dispatch => bindActionCreators({
        fetchUpdateProdPurchase,
        fetchChangeProPurchaseStatus,
        fetchDeleteProdPurchaseById,
    }, dispatch)
)
class SaleCard extends Component {
    constructor(props) {
        super(props);
        this.handleOnchange = this.handleOnchange.bind(this);
        this.confirmUsed = this.confirmUsed.bind(this);
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeMain = this.handleChangeMain.bind(this);
        this.handleCheckUse = this.handleCheckUse.bind(this);

        this.state = {
            checked: true,
            id: this.props.index
        }
    }

    componentDidMount() {
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
        this.setState({ index: this.props.index });
        this.setState({ value: checkedValues });
        // checkedValues.map(value => {
        // });
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
            onCancel: () => { },
            onOk: this.handleCheckUse
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

    /**
     * 修改启用时的确认按钮回调
     */
    handleCheckUse() {
        const { getProdPurchaseByIds } = this.props;
        this.props.fetchChangeProPurchaseStatus({
            id: getProdPurchaseByIds.id,
            productId: getProdPurchaseByIds.productId,
            status: getProdPurchaseByIds.status
        })
            .then((res) => {
                this.confirmUsed(res.success)
            }).catch((res) => {
                message.error(res.message)
            })
    }

    handleDelete(e) {
        e.stopPropagation();
        const { handleDelete } = this.props;
        const id = e.target.getAttribute('data-id');
        Modal.confirm({
            title: '删除',
            content: '是否删除当前关系列表?',
            onOk: () => {
                handleDelete(id);
            },
            onCancel() { },
        });
    }

    handleCardClick = (item) => {
        this.props.handleCardClick(item)
    }

    handleChangeStatus(e, item) {
        const { handleChangeStatus } = this.props;
        Modal.confirm({
            title: '提示',
            content: `确定${item.status === 1 ? '禁用' : '启用'}？`,
            onOk: () => {
                handleChangeStatus({
                    id: item.id,
                    status: item.status === 1 ? 0 : 1,
                })
            },
            onCancel() { },
        });
    }

    renderCard = (datas) => {
        const { prefixCls, minUnit } = this.props;
        return datas.map((item) => (
            <div
                key={item.id}
                className={`${prefixCls}-card-list`}
            >
                <Card
                    style={{ width: 350 }}
                    className={
                        `${prefixCls}-sale-card-${item.status}
                                ${prefixCls}-supplierType-img`
                    }
                    onClick={() => this.handleCardClick(item)}
                >
                    <a
                        className={`${prefixCls}-close`}
                        data-id={item.id}
                        style={{ float: 'right' }}
                        onClick={this.handleDelete}
                    >
                        &times;
                        </a>
                    <div className={`${prefixCls}-card-wrap`}>
                        <p>
                            <span>子公司 : </span>
                            <span>{item.branchCompanyId}</span>
                            <b>-</b>
                            <span>{item.branchCompanyName}</span>
                        </p>
                        <p>
                            <span>销售内装数 : </span>
                            <span>{item.salesInsideNumber}</span>
                        </p>
                        <p>
                            <span>起订量 : </span>
                            <span>{item.minNumber}</span>
                        </p>
                        <p>
                            <span>最大销售 : </span>
                            <span>{item.maxNumber}</span>
                        </p>
                        <p>
                            <span>采购模式 : </span>
                            <span>{item.preHarvestPinStatus === 0 ? '先销后采' : '先采后销'}</span>
                        </p>
                        <p>
                            <span>承诺发货时间 : </span>
                            <span>下单后{item.deliveryDay}天内发货</span>
                        </p>
                        <p>
                            <span>销售价格 : </span>
                            <ul className={`${prefixCls}-step-price`}>
                                {
                                    item.sellSectionPrices.map((i) =>
                                        (
                                            <li className={`${prefixCls}-step-item`}>
                                                <span
                                                    className={`${prefixCls}-step-item-left`}
                                                >
                                                    {`${i.startNumber} - ${i.endNumber ===
                                                        MAXGOODS ? '最大值' :
                                                        i.endNumber} (${minUnit})`}
                                                </span>
                                                <span
                                                    className={`${prefixCls}-step-item-right`}
                                                >
                                                    {`${i.price}元/${minUnit}`}
                                                </span>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </p>
                        <p>
                            <span>建议零售价(元) : </span>
                            <span>{item.suggestPrice}</span>
                        </p>
                    </div>
                    <div
                        className={`${prefixCls}-checkboxGroup`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Checkbox
                            onClick={(e) => this.handleChangeStatus(e, item)}
                            checked={!!item.status}
                        >
                            启用
                            </Checkbox>
                    </div>
                </Card>
            </div>
        )
        )
    }

    render() {
        const { prefixCls, initalValue = {} } = this.props;
        return (
            <div className={classNames(`${prefixCls}`, `${prefixCls}-sale`)}>
                <div>
                    {
                        initalValue.data && initalValue.data.length > 0
                            ? <Form>
                                {
                                    this.renderCard(initalValue.data)
                                }
                                <Pagination
                                    current={initalValue.pageNumber}
                                    pageSize={PAGE_SIZE}
                                    onChange={this.handlePaginationChange}
                                    total={initalValue.total}
                                />
                            </Form>
                            : <div className={`${prefixCls}-no-data`}>
                                暂无数据
                        </div>
                    }
                </div>
            </div>
        );
    }
}

SaleCard.propTypes = {
    getProdPurchaseByIds: PropTypes.objectOf(PropTypes.any),
    minUnit: PropTypes.objectOf(PropTypes.any),
    fetchUpdateProdPurchase: PropTypes.func,
    handleCardClick: PropTypes.func,
    fetchChangeProPurchaseStatus: PropTypes.func,
    prefixCls: PropTypes.string,
    index: PropTypes.number,
    initalValue: PropTypes.objectOf(PropTypes.any),
    handleDelete: PropTypes.func,
    handleChangeStatus: PropTypes.func,
};

SaleCard.defaultProps = {
    prefixCls: 'card-line',
    isSale: false,
    initalValue: {},
    handleDelete: () => { },
    handleChangeStatus: () => { }
};

export default Form.create()(SaleCard);
