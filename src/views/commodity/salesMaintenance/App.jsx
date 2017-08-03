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
    fecthCheckMainSupplier,
    modifyAuditVisible,
    modifyCheckReasonVisible,
    fecthGetProdPurchaseById,
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

@connect(
    state => ({
        applicationData: state.toJS().supplier.applicationData,
        auditVisible: state.toJS().supplier.auditVisible,
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        insertSettlementResult: state.toJS().supplier.insertSettlementResult,
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProdPurchaseById: state.toJS().commodity.getProdPurchaseById,
        queryProdPurchases: state.toJS().commodity.queryProdPurchases,
        getProductById: state.toJS().commodity.getProductById,
        stepPriceList: state.toJS().commodity.stepPriceList,
    }),
    dispatch => bindActionCreators({
        fecthCheckMainSupplier,
        modifyAuditVisible,
        modifyCheckReasonVisible,
        fecthGetProdPurchaseById,
        fetchGetProductById,
        fetchPriceInfo
    }, dispatch)
)
class ProcurementMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

        this.searchForm = {};
        this.current = 1;
        this.state = {
            // 控制当前操作card下标
            index: 0,
            // 默认值
            value: [],
            // 控制主供应商选项唯一
            disabled: false
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
     * 新增
     */
    handleAdd() {
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
        deleteSellPriceById({
            id,
            productId: getProductById.id,
        }).then(() => {
            this.handlePaginationChange();
        })
    }

    handleFormSearch = (data) => {
        const { getProductById = {} } = this.props;
        this.props.fetchPriceInfo({
            pageNum: this.current,
            pageSize: PAGE_SIZE,
            productId: getProductById.id,
            ...data
        });
    }

    handleAdd = () => {

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
                        initalValue={stepPriceList.sellPriceInfoVos || []}
                        handleDelete={this.handleDelete}
                        isSale
                    />
                </div>
                <SellPriceModal />
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    fetchProviderEnterList: PropTypes.objectOf(PropTypes.any),
    fecthGetProdPurchaseById: PropTypes.func,
    modifyAuditVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.bool,
    prefixCls: PropTypes.string,
    getProductById: PropTypes.objectOf(PropTypes.any),
    fetchPriceInfo: PropTypes.func,
}

ProcurementMaintenance.defaultProps = {
    prefixCls: 'card-line',
};

export default withRouter(Form.create()(ProcurementMaintenance));
