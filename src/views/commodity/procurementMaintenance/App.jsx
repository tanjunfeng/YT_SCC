/**
 * @file app.jsx
 * @author Tan junfeng
 *
 * 商品采购关系维护
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
    Form, Pagination
} from 'antd';

import {
    modifyAuditVisible,
    modifyCheckReasonVisible,
    fecthGetProdPurchaseById,
    fetchGetProductById,
    fetchAddProdPurchase,
    fetchQueryProdByCondition
} from '../../../actions';
import SearchForm from '../searchFormProcure';
import ShowForm from '../showFormProcure';
import Cardline from '../card';
import { PAGE_SIZE } from '../../../constant';


@connect(
    state => ({
        applicationData: state.toJS().supplier.applicationData,
        auditVisible: state.toJS().supplier.auditVisible,
        checkResonVisible: state.toJS().supplier.checkResonVisible,
        insertSettlementResult: state.toJS().supplier.insertSettlementResult,
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductById: state.toJS().commodity.getProductById,
    }),
    dispatch => bindActionCreators({
        modifyAuditVisible,
        modifyCheckReasonVisible,
        fecthGetProdPurchaseById,
        fetchGetProductById,
        fetchAddProdPurchase,
        fetchQueryProdByCondition
    }, dispatch)
)
class ProcurementMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.onChange = ::this.onChange;

        this.searchForm = {};
        this.current = 1;
        this.state = {
            // 控制当前操作card下标
            index: 0,
            // 默认值
            value: [],
            // 控制主供应商选项唯一
            disabled: false,
            current: 1
        }
    }

    /**
     * 加载刷新列表
     */
    componentDidMount() {
        this.props.fecthGetProdPurchaseById({
            id: 2
        });
        this.props.fetchGetProductById({
            productId: 1001
        });
    }

    /**
     * 新增
     */
    handleAdd() {
        // this.props.fetchAddProdPurchase() {

        // }
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
        this.brandSearchMind.handleClear();
    }

    /**
     *列表分页
     *
     * @param {string} goto 数据列表分页
     */
    handlePaginationChange(goto) {
        this.current = goto;
        this.props.fetchQueryProdByCondition({
            pageNum: goto,
            pageSize: PAGE_SIZE,
            ...this.searchForm
        });
    }

    onChange = (page) => {
        console.log(page);
        this.setState({
            current: page,
        });
    }


    render() {
        const { prefixCls, getProductById } = this.props;
        const innitalvalue = getProductById;
        return (
            <div className={`${prefixCls}-min-width application`}>
                <ShowForm innitalvalue={innitalvalue} />
                <SearchForm
                    onSearch={this.handleFormSearch}
                    onReset={this.handleFormReset}
                    handleAdd={this.handleAdd}
                />
                <div>
                    <Cardline />
                </div>
                <Pagination
                    current={this.state.current}
                    onChange={this.handlePaginationChange}
                    total={10}
                />
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
    fetchQueryProdByCondition: PropTypes.func,
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    fecthGetProdPurchaseById: PropTypes.func,
    modifyAuditVisible: PropTypes.bool,
    modifyCheckReasonVisible: PropTypes.bool,
    prefixCls: PropTypes.string,
    getProductById: PropTypes.objectOf(PropTypes.any)
}

ProcurementMaintenance.defaultProps = {
    prefixCls: 'card-line',
};

export default withRouter(Form.create()(ProcurementMaintenance));
