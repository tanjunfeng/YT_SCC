/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 商品销售关系维护
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form,
} from 'antd';

import {
    modifyAuditVisible,
    modifyCheckReasonVisible,
    fetchGetProductById
} from '../../../actions';
import {
    deleteSellPriceById
} from '../../../service'
import SearchForm from '../searchFormSales';
import ShowForm from '../showFormSales';
import Cardline from '../card';
import { PAGE_SIZE } from '../../../constant';
import { fetchPriceInfo } from '../../../actions/procurement';
import SellPriceModal from '../sellPriceModal'
import {
    postSellPrice,
    updateSellPrice,
    updatePriceStatus
} from '../../../actions/commodity';

@connect(
    state => ({
        applicationData: state.toJS().supplier.applicationData,
        auditVisible: state.toJS().supplier.auditVisible,
        checkReasonVisible: state.toJS().supplier.checkReasonVisible,
        insertSettlementResult: state.toJS().supplier.insertSettlementResult,
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseById: state.toJS().commodity.getProdPurchaseById,
        queryProdPurchases: state.toJS().commodity.queryProdPurchases,
        getProductById: state.toJS().commodity.getProductById,
        stepPriceList: state.toJS().commodity.stepPriceList,
    }),
    dispatch => bindActionCreators({
        modifyAuditVisible,
        modifyCheckReasonVisible,
        fetchGetProductById,
        fetchPriceInfo,
        postSellPrice,
        updateSellPrice,
        updatePriceStatus
    }, dispatch)
)
class ProcurementMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);

        this.searchForm = {};
        this.current = 1;
        this.state = {
            // 控制当前操作card下标
            index: 0,
            // 默认值
            value: [],
            // 控制主供应商选项唯一
            disabled: false,
            // 是否是编辑
            isEdit: false
        }
    }
    /**
     * 加载刷新列表
     */
    componentDidMount() {
        const { match } = this.props;
        this.props.fetchPriceInfo({
            productId: match.params.id
        });
        this.props.fetchGetProductById({
            productId: match.params.id
        });
    }

    /**
     * 表单操作弹出层
     *
     * @param {string} text 文本内容
     * @param {Object} record 模态框状态
     * @param {string} index 下标
     */
    handleSelect(record, index, item) {
        const { key } = item;
        switch (key) {
            case 'changeAudit':
                this.props.modifyAuditVisible({isVisible: true, record});
                break;
            case 'CheckReason':
                this.props.modifyCheckReasonVisible({isVisible: true, record});
                break;
            default:
                break;
        }
    }

    /**
     * 重置
     *
     * @param {Object} data 重置的表单
     */
    handleFormReset(data) {
        this.searchForm = data;
    }

    /**
     *列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto = 1) {
        this.current = goto;
        this.props.fetchPriceInfo({
            pageNum: goto,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    /**
     * 删除card
     */
    handleDelete = (id) => {
        const { getProductById = {} } = this.props;
        const pid = getProductById.id;
        deleteSellPriceById({
            id,
            productId: pid,
        }).then(() => {
            this.props.fetchPriceInfo({
                pageNum: this.current,
                pageSize: PAGE_SIZE,
                productId: pid,
                ...this.data
            });
        })
    }

    handleFormSearch = (data) => {
        this.data = data;
        const { getProductById = {} } = this.props;
        this.props.fetchPriceInfo({
            pageNum: this.current,
            pageSize: PAGE_SIZE,
            productId: getProductById.id,
            ...this.data
        });
    }

    handleAdd = () => {
        const { getProductById } = this.props
        this.setState({
            datas: getProductById,
            show: true,
        })
    }

    handleCardClick = (data) => {
        this.setState({
            datas: data,
            isEdit: true,
            show: true,
        })
    }

    handleClose = () => {
        this.setState({
            show: false,
            isEdit: false
        })
    }

    handlePostAdd = (data, isEdit) => {
        const { getProductById = {} } = this.props;
        const service = isEdit ? this.props.updateSellPrice : this.props.postSellPrice;
        service(data).then(() => {
            this.props.fetchPriceInfo({
                pageNum: this.current,
                pageSize: PAGE_SIZE,
                productId: getProductById.id,
                ...this.data
            });
            this.handleClose()
        })
    }

    handleChangeStatus = (data) => {
        const { getProductById = {} } = this.props;
        this.props.updatePriceStatus(data).then(() => {
            this.props.fetchPriceInfo({
                pageNum: this.current,
                pageSize: PAGE_SIZE,
                productId: getProductById.id,
                ...this.data
            });
        });
    }

    render() {
        const { prefixCls, getProductById, stepPriceList = {}} = this.props;
        return (
            <div className={`${prefixCls}-min-width application`}>
                <ShowForm
                    innitalvalue={getProductById}
                    isSale
                />
                <SearchForm
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    handleAdd={this.handleAdd}
                />
                <div>
                    <Cardline.SaleCard
                        initalValue={stepPriceList.sellPriceInfoVos || {}}
                        minUnit={getProductById.minUnit}
                        handleDelete={this.handleDelete}
                        handleCardClick={this.handleCardClick}
                        handleChangeStatus={this.handleChangeStatus}
                        isSale
                    />
                </div>
                {
                    this.state.show &&
                    <SellPriceModal
                        datas={this.state.datas}
                        handleClose={this.handleClose}
                        handleAdd={this.handleAdd}
                        handlePostAdd={this.handlePostAdd}
                        isEdit={this.state.isEdit}
                    />
                }
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    match: PropTypes.objectOf(PropTypes.any),
    modifyAuditVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.bool,
    prefixCls: PropTypes.string,
    getProductById: PropTypes.objectOf(PropTypes.any),
    fetchPriceInfo: PropTypes.func,
    postSellPrice: PropTypes.func,
    updatePriceStatus: PropTypes.func,
    stepPriceList: PropTypes.func,
    updateSellPrice: PropTypes.func
}

ProcurementMaintenance.defaultProps = {
    prefixCls: 'card-line',
    postSellPrice: () => {}
};

export default withRouter(Form.create()(ProcurementMaintenance));
