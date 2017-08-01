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
    fecthGetProdPurchaseById,
    fetchGetProductById,
    fetchAddProdPurchase,
    fetchQueryProdByCondition,
    modifyAuditVisible
} from '../../../actions';
import SearchForm from '../searchFormProcure';
import ShowForm from '../showFormProcure';
import Cardline from '../card';
import { PAGE_SIZE } from '../../../constant';
import ProdPurchaseModal from '../prodPurchaseModal';
import { productAddPriceVisible } from '../../../actions/producthome';


@connect(
    state => ({
        prodPurchase: state.toJS().commodity.prodPurchase,
        getProductById: state.toJS().commodity.getProductById,
        getProdPurchaseByIds: state.toJS().commodity.getProdPurchaseById,
        toAddPriceVisible: state.toJS().commodity.toAddPriceVisible,
    }),
    dispatch => bindActionCreators({
        fecthGetProdPurchaseById,
        fetchGetProductById,
        fetchAddProdPurchase,
        fetchQueryProdByCondition,
        productAddPriceVisible,
        modifyAuditVisible
    }, dispatch)
)
class ProcurementMaintenance extends PureComponent {
    constructor(props) {
        super(props);

        this.handleFormReset = this.handleFormReset.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.onChange = ::this.onChange;
        this.handleAdd = ::this.handleAdd;

        this.searchForm = {};
        this.current = 1;
        this.state = {
            // 控制当前操作card下标
            index: 0,
            // 默认值
            value: [],
            // 控制主供应商选项唯一
            disabled: false,
            current: 1,
            productId: null
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


    onChange = (page) => {
        // console.log(page);
        this.setState({
            current: page,
        });
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
     * 新增
     *
     * @param {Object} record 模态框数据
     */
    handleAdd() {
        this.props.productAddPriceVisible({isVisible: true});
    }

    render() {
        const { prefixCls, getProductById } = this.props;
        const innitalvalue = getProductById;
        return (
            <div className={`${prefixCls}-min-width application`}>
                <ShowForm innitalvalue={innitalvalue} />
                <SearchForm
                    innitalvalue={innitalvalue}
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
                <ProdPurchaseModal />
            </div>
        );
    }
}

ProcurementMaintenance.propTypes = {
    fetchQueryProdByCondition: PropTypes.func,
    fetchGetProductById: PropTypes.objectOf(PropTypes.any),
    fecthGetProdPurchaseById: PropTypes.func,
    productAddPriceVisible: PropTypes.func,
    prefixCls: PropTypes.string,
    getProductById: PropTypes.objectOf(PropTypes.any)
}

ProcurementMaintenance.defaultProps = {
    prefixCls: 'card-line',
};

export default withRouter(Form.create()(ProcurementMaintenance));
